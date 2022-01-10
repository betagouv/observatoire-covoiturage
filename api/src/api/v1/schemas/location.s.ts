export default class locationSchema {
  
  static location = {
    tags: ['location'],
    querystring: {
      date_1: {
        type: 'string',
        description: 'Start date'
      },
      date_2: {
        type: 'string',
        description: 'End date'
      }
    },
    response: {
      200: {
        type: 'array',
        description:'coordonnées des trajets de la période sélectionnée (tout sens confondus)',
        items: {
          properties: {
            hex:{type:'string'},
            count:{type:'number'}
          }
        }
      }
    }
  }
}