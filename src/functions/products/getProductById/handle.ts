import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { TABLE_NAME, REGION } from '@libs/constants';

const dbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dbClient);

export const getProductById = async (event: any) => {
  try {
    const productId = event.pathParameters?.productId;

    if (!productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "O 'productId' é obrigatório." }),
      };
    }

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        productId: productId,
      },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `Produto com ID ${productId} não encontrado.` }),
      };
    }
    const product = response.Item;
    const orderedProduct = {
      productId: product.productId,
      name: product.name,
      category: product.category,
      price: product.price,
      url: product.url,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(orderedProduct),
    };

  } catch (error) {
    console.error('ERRO AO BUSCAR PRODUTO:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno do servidor ao buscar o produto.' }),
    };
  }
};