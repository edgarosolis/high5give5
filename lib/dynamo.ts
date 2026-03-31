import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.APP_AWS_REGION || process.env.AWS_REGION || "us-east-1",
});

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const TABLE = process.env.DYNAMODB_TABLE_NAME || "High5Give5Content";

export async function getItem(pk: string, sk: string) {
  const { Item } = await docClient.send(
    new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: sk } })
  );
  return Item ?? null;
}

export async function putItem(item: Record<string, unknown>) {
  await docClient.send(
    new PutCommand({ TableName: TABLE, Item: item })
  );
}

export async function deleteItem(pk: string, sk: string) {
  await docClient.send(
    new DeleteCommand({ TableName: TABLE, Key: { PK: pk, SK: sk } })
  );
}

export async function queryByPK(pk: string) {
  const { Items } = await docClient.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": pk },
    })
  );
  return Items ?? [];
}

export async function queryBySKPrefix(pk: string, skPrefix: string) {
  const { Items } = await docClient.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: { ":pk": pk, ":sk": skPrefix },
    })
  );
  return Items ?? [];
}

export async function batchWrite(items: Record<string, unknown>[]) {
  // DynamoDB BatchWrite supports max 25 items per call
  const chunks = [];
  for (let i = 0; i < items.length; i += 25) {
    chunks.push(items.slice(i, i + 25));
  }

  for (const chunk of chunks) {
    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [TABLE]: chunk.map((item) => ({
            PutRequest: { Item: item },
          })),
        },
      })
    );
  }
}
