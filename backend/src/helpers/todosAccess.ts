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
const s3BucketName = process.env.S3_BUCKET;
const userIdIndex = process.env.INDEX_NAME;

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
  logger.info(`creating todoItem with id: ${todoItem.todoId}`);

  const params = {
    TableName: todosTable,
    Item: todoItem,
  };

  await docClient.put(params).promise();

  return todoItem as TodoItem;
};

export const getTodos = async (userId) => {
  const result = await docClient
    .query({
      TableName: todosTable,
      IndexName: userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    .promise();

  return result.Items;
};

export const deleteTodo = async (todoId: string, userId: string) => {
  await docClient
    .delete({
      TableName: todosTable,
      Key: {
        todoId,
        userId,
      },
    })
    .promise();
};

export const getTodo = async (todoId: string, userId: string) => {
  const response = await docClient
    .get({
      TableName: todosTable,
      Key: {
        todoId,
        userId,
      },
    })
    .promise();

  return response.Item;
};

export const updateTodo = async (todoId, userId, updatedTodo) => {
  return await docClient
    .update({
      TableName: todosTable,
      Key: {
        todoId,
        userId,
      },
      UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
      ExpressionAttributeValues: {
        ':n': updatedTodo.name,
        ':due': updatedTodo.dueDate,
        ':d': updatedTodo.done,
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done',
      },
    })
    .promise();
};
