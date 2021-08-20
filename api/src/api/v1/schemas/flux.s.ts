export default class monthlyFluxSchema {
  
  static journeysMonthly = {
    tags: ['flux'],
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
        description:'Nb de trajets entre communes (tout sens confondus)',
        items: {
          properties: {
            territory_1: {type:'string'},
            l_territory_1: {type:'string'},
            territory_1_lng:{type:'number'},
            territory_1_lat:{type:'number'},
            territory_2: {type:'string'},
            l_territory_2: {type:'string'},
            territory_2_lng:{type:'number'},
            territory_2_lat:{type:'number'},
            journeys:{type:'integer'},
            passengers:{type:'integer'}
          }
        }
      }
    }
  }

  static lastRecordJourneysMonthly = {
    tags: ['flux'],
    response: {
      200: {
        type: 'object',
        description:'Return last Month and Year available in journeys monthly flux',
        properties: {
          month: {type:'string'},
          year: {type:'string'}
        }
      }
    }
  }
}
