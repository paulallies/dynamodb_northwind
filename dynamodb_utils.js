const AWS = require("aws-sdk");
const options = {
  region: process.env.REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
};
const DDB = new AWS.DynamoDB(options);
const documentClient = new AWS.DynamoDB.DocumentClient(options);
const ULID = require("ulid");
const DynamodbTable = process.env.DYNAMODB_TABLE;

exports.ddbCreateTypeCollectionItems = ({ data, type, sort_key_prop }) => {
  const result = data.map((item) => {
    const id = ULID.ulid();
    return {
      PK: `${type}#${id}`,
      SK: `${type}#${id}`,
      PK_TYPE: type,
      SK_TYPE: item[sort_key_prop].toUpperCase(),
      ...item,
    };
  });

  return result;
}

exports.deleteBatch = async (list) => {
  const items = list.map((item) => {
    return {
      DeleteRequest: {
        Key: {
          PK: item.PK,
          SK: item.SK
        },
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
exports.ddbQuery = async ({ index = null, PK, SK = "", PKValue, SKValue = "" }) => {
  let KeyConditionExpression = `${PK} = :pkValue`;
  let ExpressionAttributeValues = {
    ":pkValue": PKValue
  };



  if (SK && SKValue) {
    KeyConditionExpression = appendSortQuery(KeyConditionExpression, SK);
    ExpressionAttributeValues[":skValue"] = SKValue
  }

  const itemPayload = await documentClient.query({
    TableName: DynamodbTable,
    IndexName: index,
    KeyConditionExpression,
    ExpressionAttributeValues,
  }).promise();

  return itemPayload.Items;
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

exports.createGSI = async ({ name, PK, SK }) => {
  await DDB.updateTable({
    TableName: DynamodbTable,
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
    BillingMode: "PAY_PER_REQUEST",
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
  console.log("Created Index: " + name)
};
