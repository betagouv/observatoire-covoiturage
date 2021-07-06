export default class occupationSchema {
  
  static occupationMonthly = {
    tags: ['occupation'],
    querystring: {
      t: {
        type: 'string',
        description: 'type of territories'
      },
      year: {
        type: 'string',
        description: 'Year (YYYY)'
      },
      month: {
        type: 'string',
        description: 'Month (MM)'
      }
    },
    response: {
      200: {
        type: 'array',
        description:'Trajets et taux d\'occupation mensuels pour le type de territoires selectionné (tout sens confondus)',
        items: {
          properties: {
            territory: {type:'string'},
            l_territory:{type:'string'},
            journeys:{type:'integer'},
            passengers:{type:'integer'},
            occupation_rate:{type:'number'},
            geom:{type:'object',
              properties: {
                type: {type:'string'},
                coordinates:{type:'array',minItems: 2,maxItems: 2,items:{ type: 'number'}}
              }
            }
          }
        }
      }
    }
  }
}