import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import locationTypes from '../types/location.t'
import { geoToH3 } from 'h3-js'

export default class locationHandler {
  
  static pg: FastifyInstance["pg"]  

  static async location(request: FastifyRequest<locationTypes.periode>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const result:Array<{hex:string,count:unknown}> = []
      const sql = `
      SELECT journey_start_lon as lon, 
      journey_start_lat as lat 
      FROM rpc WHERE journey_start_date BETWEEN '${request.query.date_1}' 
      AND '${request.query.date_2}'
      ${(request.query.t && request.query.code) ? 
        `AND (journey_start_insee IN (SELECT com FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = ${request.query.date_2.substring(0,4)}) t WHERE ${request.query.t} = '${request.query.code}') 
        OR journey_end_insee IN (SELECT com FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = ${request.query.date_2.substring(0,4)}) t WHERE ${request.query.t} = '${request.query.code}'))`
        : ''
      } 
      UNION ALL 
      SELECT journey_end_lon as lon, 
      journey_end_lat as lat 
      FROM rpc WHERE journey_start_date BETWEEN '${request.query.date_1}'
      AND '${request.query.date_2}'
      ${(request.query.t && request.query.code) ? 
        `AND (journey_start_insee IN (SELECT com FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = ${request.query.date_2.substring(0,4)}) t WHERE ${request.query.t} = '${request.query.code}') 
        OR journey_end_insee IN (SELECT com FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = ${request.query.date_2.substring(0,4)}) t WHERE ${request.query.t} = '${request.query.code}'))`
        : ''
      }
      ;`
      const sqlResult = await client.query(sql)
      if (!sqlResult.rows) {
        reply.code(404).send(new Error('page not found'))
      }
      else if (sqlResult.rows.length === 0) {
        reply.code(404).send(new Error('Pas de données disponibles'))
      }
      const geomToHex = sqlResult.rows
        .map(r => geoToH3(r.lat,r.lon, request.query.zoom))
        .reduce((acc:any, curr) => (acc[curr] = (acc[curr] || 0) + 1, acc), {})
      Object.entries(geomToHex).forEach(([key, val]) => result.push({hex:key, count:val}))
      reply.send(result)
      client.release()
    } catch (err) {
      reply.send(err)
    }
  }
  // Retourne la date du dernier enregistrement de la table rpc
  static async lastRecordRpc(request: FastifyRequest, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT to_char(journey_start_date,'YYYY-MM-DD') as date FROM rpc ORDER BY journey_start_date DESC LIMIT 1;`
      const {rows} = await client.query(sql)
      if (!rows) {
        reply.code(404).send(new Error('page not found'))
      }
      reply.send(rows[0])
      client.release()
    } catch (err) {
      reply.send(err)
    }
  }
}
