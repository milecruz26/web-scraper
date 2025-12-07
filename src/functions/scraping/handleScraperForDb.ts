import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { scrapingAmazonBestSellers } from "../../../scraper";
import { Product } from './../../interface/Product';

const REGION = 'us-east-1';
const TABLE_NAME = 'ProductsBestSellers';

const dbClient = new DynamoDBClient({ region: REGION });
const dynamo = DynamoDBDocumentClient.from(dbClient);

export async function handleScraperForDb() {
  console.log('INICIANDO SCRAPING E ARMAZENAMENTO NO DYNAMONDB...');

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "Scraping e armazenamento de dados concluído." }),
  };
  try {
    const productList: Product[] = await scrapingAmazonBestSellers();

    const hasData = productList && productList.length > 0;

    if (hasData) {
      console.log(`Dados encontrados. Total de produtos: ${productList.length}`);
      let totalSaved = 0;

      for (const product of productList) {

        const itemToSave = {
          productId: product.productId,
          name: product.name,
          price: product.price,
          url: product.url,
          category: product.category,
        };

        const params = {
          TableName: TABLE_NAME,
          Item: itemToSave,
        };

        await dynamo.send(new PutCommand(params));
        totalSaved++;
      }

      console.log(`Total de ${totalSaved} produtos salvos/atualizados.`);
      response.body = JSON.stringify({ message: `Scraping concluído. ${totalSaved} produtos salvos.`, total: totalSaved });

    } else {
      console.log("Nenhum dado válido foi extraído do scraping.");
      response.statusCode = 404;
      response.body = JSON.stringify({ message: "Lista vazia retornada pelo scraping." });
    }

  } catch (error) {
    console.error("ERRO DURANTE O PROCESSAMENTO/DB:", error);
    response.statusCode = 500;
    response.body = JSON.stringify({ message: "Erro interno no processamento do scraper e DB.", error: (error as Error).message });
  }

  console.log('SALVAMENTO CONCLUÍDO! PRODUTOS SALVO NO DB.');
  return response;

}