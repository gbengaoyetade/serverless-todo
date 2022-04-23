import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { updateTodo } from '../../helpers/todos';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
  const logger = createLogger('auth');
  const updated = await updateTodo(event, updatedTodo);
  logger.info('updating a todo item...');
  if (!updated) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Item does not exist',
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({}),
  };
};
