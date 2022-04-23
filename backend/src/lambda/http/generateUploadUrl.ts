import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';

import { generateUploadUrl } from '../../helpers/todosAccess';
import { createLogger } from '../../utils/logger';

const logger = createLogger('Upload URL');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;

    logger.info(`Generating upload URL for todo item: ${todoId}`);
    const URL = await generateUploadUrl(todoId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        uploadUrl: URL,
      }),
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
