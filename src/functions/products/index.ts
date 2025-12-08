import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handle.getProducts`,
  timeout: 7,
  events: [
    {
      http: {
        method: 'get',
        path: 'list-products',
        cors: true,
      }
    }

  ]
}