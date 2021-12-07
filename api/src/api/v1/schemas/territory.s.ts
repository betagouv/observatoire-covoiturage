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

  static territoryIndicators = {
    tags: ['territories'],
    querystring: {
      territory: {
        type: 'string',
        description: 'territory id'
      },
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
        items: {
          properties: {
            year: {type:'string'},
            month: {type:'string'},
            territory: {type:'string'},
            l_territory: {type:'string'},
            journeys: {type:'integer'},
            distance: {type:'number'},
            occupation_rate: {type:'number'},
            trips: {type:'integer'},
            nb_aires: {type:'integer'}
          }
        }
      }
    }
  }

  static territoryBestJourneys = {
    tags: ['territories'],
    querystring: {
      territory: {
        type: 'string',
        description: 'territory id'
      },
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
        items: {
          properties: {
            territory_1: {type:'string'},
            l_territory_1: {type:'string'},
            territory_2: {type:'string'},
            l_territory_2: {type:'string'},
            journeys: {type:'integer'}
          }
        }
      }
    }
  }
}