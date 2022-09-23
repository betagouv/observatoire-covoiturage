import fp from 'fastify-plugin'
import {FastifyPluginAsync} from 'fastify'
import { join } from 'path'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import swagger from 'fastify-oas'
import autoLoad from 'fastify-autoload'
import cache from 'fastify-caching'


const config: FastifyPluginAsync = async (server, options) => { 
  
  // add CORS and Helmet
  server.register(cors,{origin:'*'})
  server.register(helmet)

  // cache
  server.register(cache, {
    privacy: 'public',
    expiresIn: 3600,
    serverExpiresIn:86400
  }
)

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
      host: process.env.DOMAIN+':'+process.env.PORT || 'localhost',
      schemes: ['http','https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'admin', description: 'Administration panel related end-points' }
      ],
    },
    exposeRoute: true
  })
  // add routes repository for V1
  server.register(autoLoad, {
    dir: join(__dirname,'../api/v1/routes'),
    options: { prefix: '/v1/' },
  })

  server.register(require('@fastify/http-proxy'), {
    upstream: 'https://stats.covoiturage.beta.gouv.fr/api',
    prefix: '/v1/stats', // optional
  })
}
export default fp(config)
