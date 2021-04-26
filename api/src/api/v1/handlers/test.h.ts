import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'

export default class testHandler {
  
  static pg: FastifyInstance["pg"]  
  
  static async listDbTable(request: FastifyRequest, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `with trips as (
        select 
        case when length(journey_start_insee) = 4 then '0'||journey_start_insee else journey_start_insee end as origin,
        case when length(journey_end_insee) = 4 then '0'||journey_end_insee else journey_end_insee end as destination,
        1 as vehicles,
        count(trip_id) as passengers,sum(passenger_seats) as reserved_seats
        from covoiturage.registre
        where journey_start_datetime::date between '2021-02-01' and '2021-03-01'
        group by trip_id,journey_start_insee,journey_end_insee
        ),
        flux as (
        select least(origin , destination) as com1, greatest(origin , destination) as com2, sum(vehicles) as vehicles, sum(passengers) as passengers, sum(reserved_seats) as reserved_seats
        from trips
        group by com1,com2
        ),
        geometry as (
        select com,l_com,geom
        from perimeters.chefs_lieux_2021
        union
        select insee_cog as com,name as l_com, ST_PointOnSurface(geom) as geom
        from perimeters.countries
        )
        select com1,b.l_com as l_com1,st_x(b.geom) as com1_lng,st_y(b.geom) as com1_lat, com2,c.l_com as l_com2,st_x(c.geom) as com2_long,st_y(c.geom) as com2_lat, vehicles,passengers,reserved_seats from flux a
        left join geometry b on a.com1=b.com
        left join geometry c on a.com2=c.com
        order by com1,com2;`
      const {rows} = await client.query(sql)
      if (!rows) {
        throw reply.code(404).send(new Error('error'))
      }
      client.release()
      return reply.send(rows)
    } catch (err) {
      return reply.send(err)
    }
  }
}
  
