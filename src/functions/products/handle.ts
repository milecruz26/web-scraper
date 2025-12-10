import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { REGION, TABLE_NAME } from "@libs/constants";

const dbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dbClient);

export const getProducts: APIGatewayProxyHandler = async () => {

  try {
    const params = {
      TableName: TABLE_NAME,
      Limit: 20,
    };
    const command = new ScanCommand(params);
    const result = await docClient.send(command);
    const products = result.Items;

    if (!result.Items || result.Items.length === 0) {
      console.log("Nenhum item encontrado na tabela.");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Nenhum produto encontrado." }),
      };
    }

    const orderedProducts = products.map((product) => {
      return {
        productId: product.productId,
        category: product.category,
        name: product.name,
        price: product.price,
        url: product.url,
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(orderedProducts),
    };

  } catch (error) {
    console.error("ERRO NA LEITURA DO DYNAMODB:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno ao acessar o banco de dados.", error: (error as Error).message }),
    };
  }
};
