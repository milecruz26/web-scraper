import type { AWS } from '@serverless/typescript';

import getProducts from '@functions/products';
import getProductsByCategory from '@functions/productsByCategory';
import getProductById from '@functions/products/getProductById';
import deleteProductById from '@functions/products/deleteProductById';




const serverlessConfiguration: AWS = {
  service: 'web-scraper',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'sa-east-1',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:GetItem',
          'dynamodb:Scan',
          'dynamodb:PutItem',
          'dynamodb:DeleteItem'
        ],
        Resource: 'arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/ProductsBestSellers',
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },

  functions: {
    getProducts: getProducts,
    getProductsByCategory: getProductsByCategory,
    getProductById: getProductById,
    deleteProductById: deleteProductById,

  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },



  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'ProductsBestSellers',
          AttributeDefinitions: [
            {
              AttributeName: 'productId',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'productId',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      }
    }
  },
};

module.exports = serverlessConfiguration;
