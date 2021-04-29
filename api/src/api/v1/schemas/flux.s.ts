export default class monthlyFluxSchema {
  
  static monthly = {
    tags: ['helpers'],
    response: {
      200: {
        type: 'array',
        description:'Return all tables in database',
        items: {
          properties: {
            com1: {type:'string'},
            l_com1: {type:'string'},
            com1_lng:{type:'number'},
            com1_lat:{type:'number'},
            com2: {type:'string'},
            l_com2: {type:'string'},
            com2_lng:{type:'number'},
            com2_lat:{type:'number'},
            vehicles:{type:'integer'},
            passengers:{type:'integer'},
            reserved_seats:{type:'integer'}
          }
        }
      }
    }
  }
}
