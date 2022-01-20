import { FastifyPluginAsync } from 'fastify'
import locationHandler from '../handlers/location.h'
import locationSchema from '../schemas/location.s'
import locationTypes from '../types/location.t'


const routes:FastifyPluginAsync = async (server) => {
  server.get<locationTypes.periode>('/location',{schema:locationSchema.location}, locationHandler.location)
  server.get('/rpc/last',{schema:locationSchema.lastRecordRpc}, locationHandler.lastRecordRpc)
}

export default routes