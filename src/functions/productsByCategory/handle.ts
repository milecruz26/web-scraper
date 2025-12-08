import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Product } from "src/interface/Product";
import { REGION, TABLE_NAME } from "@libs/constants";

const dbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dbClient);

type GroupedProducts = {
  [category: string]: Omit<Product, 'category'>[];
}

export const getProductsByCategory: APIGatewayProxyHandler = async () => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    const products = result.Items as Product[] || [];

    const grouped: GroupedProducts = products.reduce((acc, product) => {
      const { category } = product;

      const orderedProductDetails = {
        productId: product.productId,
        name: product.name,
        price: product.price,
        url: product.url,
      };

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(orderedProductDetails as Omit<Product, 'category'>);

      return acc;
    }, {} as GroupedProducts);


    console.log(`${products.length} produtos lidos e agrupados em ${Object.keys(grouped).length} categorias.`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(grouped),
    };

  } catch (error) {
    console.error("ERRO NO SCAN DO DYNAMODB:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Erro interno ao processar a lista de produtos.",
        error: (error as Error).message
      }),
    };
  }
};