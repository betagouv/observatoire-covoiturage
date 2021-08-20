export default class territorySchema {
  
  static territoriesList = {
    tags: ['territories'],
    querystring: {
      year: {
        type: 'string',
        description: 'Year (YYYY)'
      }
    },
    response: {
      200: {
        type: 'array',
        description:'Liste des territoires pour un millésime (en paramètre)',
        items: {
          properties: {
            territory: {type:'string'},
            l_territory: {type:'string'},
            type: {type:'string'}
          }
        }
      }
    }
  }
}