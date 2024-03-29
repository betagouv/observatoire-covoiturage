import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import territoryTypes from '../types/territory.t'

export default class territoryHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la vue matérialisée perimeters.territories_points pour l'année en paramètres
  static async territoriesList(request: FastifyRequest<territoryTypes.list>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT territory, l_territory, type 
      FROM territories_point
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

  static async singleTerritory(request: FastifyRequest<territoryTypes.single>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT distinct territory, l_territory, type 
      FROM territories_point
      WHERE year = '${request.query.year}'
      AND territory ='${request.query.code}'
      AND type = '${request.query.type}';`
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
      const sql = `SELECT b.territory,b.l_territory,
      sum(a.passengers) AS passengers,
      sum(a.distance) AS distance,
      sum(a.duration) AS duration,
      b.journeys,
      (SELECT journeys 
        FROM monthly_flux
        WHERE territory_1 = territory_2
      AND year = ${request.query.year}
      AND month = ${request.query.month}
      AND type= '${request.query.t}'
      AND territory_1 = '${request.query.territory}') as intra_journeys,
      b.trips,
      b.has_incentive,
      b.occupation_rate,
      c.nb_aires 
      FROM monthly_flux a
      LEFT JOIN monthly_occupation b ON (a.territory_1 = b.territory OR a.territory_2 = b.territory) 
      AND a.type = b.type AND a.year = b.year AND a.month = b.month
      LEFT JOIN (
        SELECT '${request.query.territory}' AS territory, count(a.id) AS nb_aires FROM aires_covoiturage a 
        LEFT JOIN territories_code b ON a.insee = b.arr AND b.year = ${request.query.year}
        WHERE b.${request.query.t} = '${request.query.territory}'
      ) c ON b.territory = c.territory 
      WHERE b.territory = '${request.query.territory}' AND a.type = '${request.query.t}' AND a.year = ${request.query.year} AND a.month = ${request.query.month}
      GROUP BY b.territory,b.l_territory,b.journeys,b.trips,b.has_incentive,b.occupation_rate,c.nb_aires;`
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
      const sql = `SELECT l_territory_1,l_territory_2,journeys 
      FROM monthly_flux 
      WHERE year = '${request.query.year}' AND month = '${request.query.month}'
      AND (territory_1 IN (SELECT com FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = ${request.query.year}) t WHERE ${request.query.t} = '${request.query.territory}') 
      OR territory_2 IN (SELECT com FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = ${request.query.year}) t WHERE ${request.query.t} = '${request.query.territory}'))
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

  static async BestTerritories(request: FastifyRequest<territoryTypes.indicators>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT l_territory, journeys 
      FROM monthly_occupation
      WHERE year = ${request.query.year} 
      AND month = ${request.query.month}
      AND type = '${request.query.t2}'
      AND territory IN (SELECT ${request.query.t2} FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = ${request.query.year}) t WHERE ${request.query.t} = '${request.query.territory}') 
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

  static async JourneysByHours(request: FastifyRequest<territoryTypes.indicators>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql =`
      WITH journeys AS (
        SELECT EXTRACT(HOUR FROM journey_start_time)::int as hour, journey_id
        FROM rpc 
        WHERE (
          journey_start_insee IN (SELECT com FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = '${request.query.year}') t WHERE ${request.query.t} = '${request.query.territory}') 
          OR journey_end_insee IN (SELECT com FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = '${request.query.year}') t WHERE ${request.query.t} = '${request.query.territory}')
        )
        AND EXTRACT(MONTH FROM journey_start_date) = ${request.query.month}
        AND EXTRACT(YEAR FROM journey_start_date)= ${request.query.year}
        )
        SELECT hour, count(journey_id) as journeys
        FROM journeys
        GROUP BY hour
        ORDER BY hour ASC;`
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

  static async JourneysByDistance(request: FastifyRequest<territoryTypes.indicators>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql =`
      WITH journeys AS (
        SELECT journey_id, CASE WHEN journey_distance < 10000 then '0-10'
        WHEN (journey_distance >= 10000 AND journey_distance < 20000) THEN '10-20'
        WHEN (journey_distance >= 20000 AND journey_distance < 30000) THEN '20-30'
        WHEN (journey_distance >= 30000 AND journey_distance < 40000) THEN '30-40'
        WHEN (journey_distance >= 40000 AND journey_distance < 50000) THEN '40-50'
        ELSE '>50' END as dist_classes
        FROM rpc 
        WHERE (
          journey_start_insee IN (SELECT com FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = '${request.query.year}') t WHERE ${request.query.t} = '${request.query.territory}') 
          OR journey_end_insee IN (SELECT com FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = '${request.query.year}') t WHERE ${request.query.t} = '${request.query.territory}')
        )
        AND EXTRACT(MONTH FROM journey_start_date) = ${request.query.month}
        AND EXTRACT(YEAR FROM journey_start_date)= ${request.query.year}
        )
        SELECT dist_classes, count(journey_id) as journeys
        FROM journeys
        GROUP BY dist_classes
        ORDER BY dist_classes ASC;`
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

  static async getAom(request: FastifyRequest<territoryTypes.list>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql =`SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(ST_AsGeoJSON(t.*)::json)
      )
      FROM (
        SELECT aom, l_aom, ST_Multi(ST_Union(geom_simple)) as geom
        FROM perimeters
        WHERE year = ${request.query.year} 
        AND aom IS NOT NULL
        AND dep NOT IN ('971','972','973','974','976')
        GROUP BY aom,l_aom
      ) as t;`
      const { rows } = await client.query(sql)
      if (!rows) {
        reply.code(404).send(new Error('page not found'))
      }
      else if (rows.length === 0) {
        reply.code(404).send(new Error('Pas de données disponibles'))
      }
      reply.header('Content-disposition', 'attachment; filename=aom.geojson')
      reply.send(rows[0].json_build_object)
      client.release()
    } catch (err) {
      reply.send(err)
    }
  }

}
  
