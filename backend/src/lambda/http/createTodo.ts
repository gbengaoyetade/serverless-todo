import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../../helpers/todos';

const logger = createLogger('CreateTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Creating a Todo Item...');

    const newItem: CreateTodoRequest = JSON.parse(event.body);
    const todoItem = await createTodo(event, newItem);

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
