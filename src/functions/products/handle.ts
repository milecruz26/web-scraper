import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";

const REGION = 'us-east-1';
const TABLE_NAME = 'ProductsBestSellers';


const dbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dbClient);

export const getProducts: APIGatewayProxyHandler = async () => {
  console.log('INICIANDO LEITURA DE PRODUTOS');

  try {
    const params = {
      TableName: TABLE_NAME,
      Limit: 20,
    };
    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      console.log("Nenhum item encontrado na tabela.");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Nenhum produto encontrado. Tabela vazia ou erro na leitura." }),
      };
    }

    console.log(`${result.Items.length} produtos lidos com sucesso.`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result.Items),
    };

  } catch (error) {
    console.error("ERRO NA LEITURA DO DYNAMODB:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno ao acessar o banco de dados.", error: (error as Error).message }),
    };
  }
};
