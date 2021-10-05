import fp from 'fastify-plugin'
import {FastifyPluginAsync} from 'fastify'
import pg from 'fastify-postgres'


const database: FastifyPluginAsync = async (server) => {
  try {
    console.log('connecting to database...')
    server.register(pg,{
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432', 10),
    })
    console.log('database connected')
  } catch (error) {
    console.log(error)
    console.log('Make sure you have set .env variables - see .env.example')
  }
} 

export default fp(database)
