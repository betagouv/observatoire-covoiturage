import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'

export default class testHandler {
  
  static pg: FastifyInstance["pg"]  
  
  static async listDbTable(request: FastifyRequest, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT a.nspname AS schema, b.relname as table, obj_description(b.oid, 'pg_class') as description
      FROM pg_namespace a
      LEFT JOIN pg_class b ON b.relnamespace=a.oid
      WHERE a.nspname !~ '^pg_' 
      AND a.nspname not in('api','information_schema') 
      AND has_schema_privilege(current_user, a.nspname, 'USAGE') 
      AND b.relname not in('spatial_ref_sys','geometry_columns','geography_columns')
      AND b.relkind in ('r','v','m')
      ORDER BY 1;`
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
  
