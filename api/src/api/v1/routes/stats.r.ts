import { FastifyPluginAsync } from 'fastify'




const routes:FastifyPluginAsync = async (server) => {
  server.get('/v1/stats/public/card/41d3a65c-4f98-4f4e-b1b6-9bf1a46ffbc1/query',async function (request, reply) {
    return reply
  }
  )
}

export default routes