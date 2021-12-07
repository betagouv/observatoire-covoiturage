import fp from 'fastify-plugin'
import {FastifyPluginAsync} from 'fastify'
import pg from 'fastify-postgres'


const database: FastifyPluginAsync = async (server) => {
  try {
    console.log('register credentials for database connection...')
    server.register(pg,{
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432', 10),
    })
    console.log('connection registered')
  } catch (error) {
    console.log(error)
    console.log('Make sure you have set .env variables - see .env.example')
  }
} 

export default fp(database)
