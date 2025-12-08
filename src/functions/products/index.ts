import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handle.getProducts`,
  event: [
    {
      http: {
        method: 'get',
        path: 'list-products',
        cors: true,
        timeout: 10,
      }
    }

  ]
}