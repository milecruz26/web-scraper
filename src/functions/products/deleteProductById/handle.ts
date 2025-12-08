import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

import { TABLE_NAME, REGION } from '@libs/constants';

const dbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dbClient);

export const deleteProductById = async (event: any) => {
  try {
    const productId = event.pathParameters?.productId;

    if (!productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "O 'productId' é obrigatório." }),
      };
    }

    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        productId: productId,
      },
    });
    await docClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Produto com ID ${productId} deletado com sucesso.` }),
    };

  } catch (error) {
    console.error('ERRO AO DELETAR PRODUTO:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno do servidor ao deletar o produto.' }),
    };
  }
};