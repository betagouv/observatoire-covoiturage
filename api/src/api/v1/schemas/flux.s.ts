export default class monthlyFluxSchema {
  
  static passengersMonthly = {
    tags: ['flux'],
    querystring: {
      year: {
        type: 'string',
        description: 'Year (YYYY)'
      },
      month: {
        type: 'string',
        description: 'Month (MM)'
      },
      t: {
        type: 'string',
        description: 'type of territories'
      },
      code: {
        type: 'string',
        description: 'territory id'
      },
    },
    response: {
      200: {
        type: 'array',
        description:'Nb de trajets entre communes (tout sens confondus)',
        items: {
          properties: {
            ter_1: {type:'string'},
            lng_1:{type:'number'},
            lat_1:{type:'number'},
            ter_2: {type:'string'},
            lng_2:{type:'number'},
            lat_2:{type:'number'},
            passengers:{type:'integer'},
            distance:{type:'number'},
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
        description:'Return last Month and Year available in passengers monthly flux',
        properties: {
          month: {type:'string'},
          year: {type:'string'}
        }
      }
    }
  }
}
