import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handle.getProductById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'product/{productId}',
      }
    }
  ]
}