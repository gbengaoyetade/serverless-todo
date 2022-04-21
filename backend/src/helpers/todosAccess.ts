import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/TodoItem';

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('TodosAccess');
const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();
const s3Client = new XAWS.S3({ signatureVersion: 'v4' });
const todosTable = process.env.TODOS_TABLE;
const s3BucketName = process.env.S3_BUCKET_NAME;

export const generateUploadUrl = async (todoId: string): Promise<string> => {
  logger.info('Generating upload URL', todoId);

  const url = s3Client.getSignedUrl('putObject', {
    Bucket: s3BucketName,
    Key: todoId,
    Expires: 3000,
  });

  return url as string;
};

export const createTodo = async (todoItem: TodoItem): Promise<TodoItem> => {
  const params = {
    TableName: todosTable,
    Item: todoItem,
  };

  const result = await docClient.put(params).promise();
  console.log(result);

  return todoItem as TodoItem;
};
