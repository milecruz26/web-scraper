import { handleScraperForDb } from './src/functions/scraping/handleScraperForDb';

async function testLocal() {
  console.log('EXECUTANDO TESTE LOCAL DE SCRAPING E DB SAVE');

  try {
    const result = await handleScraperForDb();

    console.log('Resposta do Handler:', JSON.parse(result.body));
    console.log('Status HTTP:', result.statusCode);
    console.log('TESTE CONCLUÍDO.');

    if (result.statusCode === 200) {
      console.log('200 - SUCESSO! Verificar no DynamonDB.');
    } else {
      console.error('500 - FALHA! Verificar os logs de erro acima.');
    }

  } catch (error) {
    console.error('ERRO NA EXECUÇÃO DO TESTE:', error);
  }
}
testLocal().catch(console.error);