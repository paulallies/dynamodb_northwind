const AWS = require("aws-sdk");
const EndPoint = "http://localhost:8006";
const Region = "af-south-1";
const options = {
  region: Region,
  host: EndPoint,
};
const DDB = new AWS.DynamoDB(options);
const documentClient = new AWS.DynamoDB.DocumentClient(options);
const DynamodbTable = "NORTHWIND";

exports.deleteBatch = async (query) => {
  const items = list.map((item) => {
    return {
      DeleteRequest: {
        Item: item,
      },
    };
  });
  for (let i = 0; i < items.length; i += 25) {
    const upperLimit = Math.min(i + 25, items.length);
    const batch = items.slice(i, upperLimit);
    const params = {
      RequestItems: {
        [DynamodbTable]: batch,
      },
    };
    await documentClient.batchWrite(params).promise();
  }
};

function appendSortQuery(KeyConditionExpression, SK) {
  return KeyConditionExpression + ` and CONTAINS(${SK}, :skValue)`;
}
exports.getItems = async ({ index, PK, SK, PKValue, SKValue }) => {
  let KeyConditionExpression = `${PK} = :pkValue and RangeKey > :skValue`;
  if (SK && SKValue) {
    KeyConditionExpression = appendSortQuery(KeyConditionExpression, SK);
  }

  const itemPayload = await documentClient.query({
    TableName: DynamodbTable,
    IndexName: index,
    KeyConditionExpression,
    ExpressionAttributeValues: {
      ":pkValue": PKValue,
      ":skValue": SKValue,
    },
  });

  return itemPayload;
};

exports.writeBatch = async (list) => {
  const items = list.map((item) => {
    return {
      PutRequest: {
        Item: item,
      },
    };
  });
  for (let i = 0; i < items.length; i += 25) {
    const upperLimit = Math.min(i + 25, items.length);
    const batch = items.slice(i, upperLimit);
    const params = {
      RequestItems: {
        [DynamodbTable]: batch,
      },
    };
    await documentClient.batchWrite(params).promise();
  }
};

exports.createGSI = async ({ name, PK, SK, table }) => {
  await DDB.updateTable({
    TableName: table,
    AttributeDefinitions: [
      {
        AttributeName: PK,
        AttributeType: "S",
      },
      {
        AttributeName: SK,
        AttributeType: "S",
      },
    ],
    GlobalSecondaryIndexUpdates: [
      {
        Create: {
          IndexName: name,
          KeySchema: [
            {
              AttributeName: PK,
              KeyType: "HASH",
            },
            {
              AttributeName: SK,
              KeyType: "RANGE",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      },
    ],
  }).promise();
};
