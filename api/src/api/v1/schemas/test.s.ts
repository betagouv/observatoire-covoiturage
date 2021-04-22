export default class HelperSchema {
  
  static listDbTable = {
    tags: ['helpers'],
    response: {
      200: {
        type: 'array',
        description:'Return all tables in database',
        items: {
          properties: {
            schema: {type:'string'},
            table: {type:'string'},
            description:{type:'string', nullable:true}
          }
        }
      }
    }
  }
}
