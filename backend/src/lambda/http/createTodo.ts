import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
// import { createLogger } from '../../utils/logger';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
// import { getUserId } from '../utils';
// import { generateUploadUrl } from '../../helpers/todosAccess';
import { createTodo } from '../../helpers/todos';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newItem: CreateTodoRequest = JSON.parse(event.body);

    // const logger = createLogger('auth')
    const todoItem = await createTodo(event, newItem);
    // logger.info('Creating a Todo Item...')
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        item: todoItem,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
