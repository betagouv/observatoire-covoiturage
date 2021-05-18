export default class monthlyFluxSchema {
  
  static journeysMonthly = {
    tags: ['flux'],
    querystring: {
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
        description:'Return journeys monthly flux',
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
