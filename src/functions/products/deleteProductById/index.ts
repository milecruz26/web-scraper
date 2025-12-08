import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handle.deleteProductById`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'product/{productId}',
      }
    }
  ]
}