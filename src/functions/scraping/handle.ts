import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { scrapingAmazonBestSellers } from "./scraper";
import { Product } from '../../interface/Product';
import { REGION, TABLE_NAME } from "@libs/constants";

const dbClient = new DynamoDBClient({ region: REGION });
const dynamo = DynamoDBDocumentClient.from(dbClient);

export async function scraperForDb() {
  // console.log('INICIANDO SCRAPING E ARMAZENAMENTO NO DYNAMONDB...');

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "Scraping e armazenamento de dados concluído." }),
  };
  let productList: Product[] = [];
  try {
    productList = await scrapingAmazonBestSellers();
    // console.log(`SCRAPING CONCLUÍDO! ${productList.length} produtos obtidos. INICIANDO SALVAMENTO NO DB...`);

  } catch (scrapError) {
    console.error("ERRO DURANTE O SCRAPING:", scrapError);
    response.statusCode = 500;
    response.body = JSON.stringify({ message: "Erro interno no processamento do scraper", error: (scrapError as Error).message });
    return response;
  }
  const hasData = productList && productList.length > 0;

  if (hasData) {
    // console.log(`Dados encontrados. Total de produtos: ${productList.length}`);
    let successCount = 0;
    let errorCount = 0;

    for (const product of productList) {
      try {
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
        successCount++;
      } catch (dbError) {
        console.error(`ERRO AO SALVAR O PRODUTO ${product.productId}:`, (dbError as Error).message);
        errorCount++;
      }
      if (successCount > 0) {
        response.statusCode = 200;
        response.body = JSON.stringify({
          message: `SCRAPING E SALVAMENTO CONCLUÍDOS. ${successCount} produtos salvos com sucesso.`,
          totalScraped: productList.length,
          errors: errorCount
        });
      } else {
        response.statusCode = 500;
        response.body = JSON.stringify({
          message: "FALHA CRÍTICA: Nenhum produto pôde ser salvo no DynamomDB.",
          totalScraped: productList.length,
          errors: errorCount
        });
      }
    }
  } else {
    response.statusCode = 204;
    response.body = JSON.stringify({ message: "Scraping concluído, mas nenhuma lista vazia foi retornada." });
  }
  return response;
}