import * as todosAccess from './todosAccess';
import * as uuid from 'uuid';
import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';

const s3BucketName = process.env.S3_BUCKET_NAME;

export function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuid.v4();
  return todosAccess.createTodo({
    userId,
    todoId,
    createdAt: new Date().getTime().toString(),
    done: false,
    attachmentUrl: `https://${s3BucketName}.s3.us-east-2.amazonaws.com/${todoId}`,
    ...createTodoRequest,
  });
}
