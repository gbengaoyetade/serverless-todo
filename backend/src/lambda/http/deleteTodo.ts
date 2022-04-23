import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from 'aws-lambda';
import { deleteTodo } from '../../helpers/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger('auth');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!(await deleteTodo(event))) {
    logger.info('Item cannot be seen');

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Item does not exist',
      }),
    };
  }

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({}),
  };
};
