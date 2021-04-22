import { FastifyPluginAsync } from 'fastify'
import testHandler from '../handlers/test.h'
import testSchema from '../schemas/test.s'


const routes:FastifyPluginAsync = async (server) => {
  
  server.get('/tables',{schema:testSchema.listDbTable}, testHandler.listDbTable)
}

export default routes
