import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { updateTodo } from '../../helpers/todos';

const logger = createLogger('updateTodo');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('updating a todo item...');

  const updatePayload: UpdateTodoRequest = JSON.parse(event.body);
  const updated = await updateTodo(event, updatePayload);

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
