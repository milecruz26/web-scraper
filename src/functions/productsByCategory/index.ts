import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handle.getProductsByCategory`,
  timeout: 30,
  events: [
    {
      http: {
        method: 'get',
        path: 'list-products/grouped',
        cors: true,
      }
    }
  ]
}