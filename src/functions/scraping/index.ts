import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handle.scraperForDb`,
  event: [
    {
      schedule: {
        rate: 'rate(1 day)',
        enabled: true,
        name: 'scraperForDbSchedule',
        description: 'Dispara o scraper para atualizar os dados no DynamoDB a cada 24 horas',
      }
    }
  ]
}