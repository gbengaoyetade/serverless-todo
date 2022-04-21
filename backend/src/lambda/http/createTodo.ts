import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { getUserId } from '../utils';
import { generateUploadUrl } from '../../helpers/todosAccess';
import { createTodo } from '../../helpers/todos';

const logger = createLogger('TodosAccess');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing API Event ', event);

    const userId = getUserId(event);
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    const toDoItem = await createTodo(newTodo, userId);
    const todoId = toDoItem.todoId;
    const url = generateUploadUrl(todoId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: toDoItem,
        uploadUrl: url,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
