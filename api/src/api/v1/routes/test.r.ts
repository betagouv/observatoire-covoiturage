import { FastifyPluginAsync } from 'fastify'
import testHandler from '../handlers/test.h'
import testSchema from '../schemas/test.s'


const routes:FastifyPluginAsync = async (server) => {
  
  server.get('/flux',{schema:testSchema.listDbTable}, testHandler.listDbTable)
}

export default routes
