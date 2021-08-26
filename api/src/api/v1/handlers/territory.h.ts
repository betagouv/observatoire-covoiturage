import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import territoryTypes from '../types/territory.t'

export default class territoryHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la vue matérialisée perimeters.territories_points pour l'année en paramètres
  static async territoriesList(request: FastifyRequest<territoryTypes.list>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT territory, l_territory, type 
      FROM perimeters.territories_points
      WHERE year = '${request.query.year}'
      ORDER BY type,territory;`
      const result = await client.query(sql)
      if (!result.rows) {
        reply.code(404).send(new Error('page not found'))
      }
      else if (result.rows.length === 0) {
        reply.code(404).send(new Error('Pas de données disponibles'))
      }
      reply.send(result.rows)
      client.release()
    } catch (err) {
      reply.send(err)
    }
  }

  static async indicators(request: FastifyRequest<territoryTypes.indicators>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT b.year,b.month,b.territory,c.l_territory,sum(a.journeys) AS journeys,sum(a.passengers) AS passengers, b.journeys AS trips,b.occupation_rate,d.nb_aires FROM covoiturage.journeys_monthly_flux a
      LEFT JOIN covoiturage.journeys_monthly_occupation_rate b ON (a.territory_1 = b.territory OR a.territory_2 = b.territory) AND a.type = b.type AND a.year = b.year AND a.month = b.month
      LEFT JOIN perimeters.territories_points c ON b.territory = c.territory AND b.year = c.year AND b.type = c.type
      LEFT JOIN (SELECT '${request.query.territory}' AS territory, count(a.id) AS nb_aires FROM covoiturage.aires a 
      LEFT JOIN (select *,'XXXXX' AS country FROM perimeters.communes_${request.query.year}) b ON a.insee = b.com
      WHERE b.${request.query.t} = '${request.query.territory}') d ON b.territory = d.territory 
      WHERE b.territory = '${request.query.territory}' AND a.type = '${request.query.t}' AND a.year = '${request.query.year}' AND a.month = '${request.query.month}'
      GROUP BY b.year,b.month,b.territory,c.l_territory,b.journeys,b.occupation_rate,d.nb_aires;`
      const result = await client.query(sql)
      if (!result.rows) {
        reply.code(404).send(new Error('page not found'))
      }
      else if (result.rows.length === 0) {
        reply.code(404).send(new Error('Pas de données disponibles'))
      }
      reply.send(result.rows)
      client.release()
    } catch (err) {
      reply.send(err)
    }
  }

  static async BestJourneys(request: FastifyRequest<territoryTypes.indicators>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT a.territory_1,b.l_territory AS l_territory_1,a.territory_2,c.l_territory AS l_territory_2,a.journeys 
      FROM covoiturage.journeys_monthly_flux a
      LEFT JOIN perimeters.territories_points b ON a.year = b.year AND a.type = b.type AND a.territory_1 = b.territory
      LEFT JOIN perimeters.territories_points c ON a.year = c.year AND a.type = c.type AND a.territory_2 = c.territory
      WHERE a.year = '${request.query.year}' AND a.month = '${request.query.month}'
      AND (a.territory_1 IN (SELECT com FROM (SELECT *,'XXXXX' AS country FROM perimeters.communes_${request.query.year}) t WHERE ${request.query.t} = '${request.query.territory}') 
      OR a.territory_2 IN (SELECT com FROM (SELECT *,'XXXXX' AS country FROM perimeters.communes_${request.query.year}) t WHERE ${request.query.t} = '${request.query.territory}'))
      ORDER BY journeys DESC
      LIMIT 10;`
      const result = await client.query(sql)
      if (!result.rows) {
        reply.code(404).send(new Error('page not found'))
      }
      else if (result.rows.length === 0) {
        reply.code(404).send(new Error('Pas de données disponibles'))
      }
      reply.send(result.rows)
      client.release()
    } catch (err) {
      reply.send(err)
    }
  }

}
  
