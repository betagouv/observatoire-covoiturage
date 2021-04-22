import fp from 'fastify-plugin'
import {FastifyPluginAsync} from 'fastify'
import { join } from 'path'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import compress from 'fastify-compress'
import swagger from 'fastify-oas'
import autoLoad from 'fastify-autoload'


const config: FastifyPluginAsync = async (server, options) => { 
  
  // add CORS and Helmet
  server.register(cors)
  server.register(helmet)

  // compression - add x-protobuf
  server.register(compress, {
    customTypes: /^text\/|\+json$|\+text$|\+xml|x-protobuf$/
  })
  // add Swagger
  server.register(swagger, {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Test swagger',
        description: 'testing the fastify swagger api',
        version: '0.1.0'
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      host: 'localhost:'+process.env.PORT || 'localhost',
      schemes: ['http','https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'admin', description: 'Administration panel related end-points' }
      ],
    },
    exposeRoute: true
  })
  // add plugin repository
  server.register(autoLoad, {
    dir: join(__dirname,'../plugins'),
    options: { ...options },
  })
  // add routes repository for V1
  server.register(autoLoad, {
    dir: join(__dirname,'../api/v1/routes'),
    options: { prefix: '/v1/' },
  })
}
export default fp(config)
