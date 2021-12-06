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
            lng_1:{type:'number'},
            lat_1:{type:'number'},
            territory_2: {type:'string'},
            l_territory_2: {type:'string'},
            lng_2:{type:'number'},
            lat_2:{type:'number'},
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
