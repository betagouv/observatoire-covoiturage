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

  static singleTerritory = {
    tags: ['territories'],
    querystring: {
      year: {
        type: 'string',
        description: 'Year (YYYY)'
      },
      code: {
        type: 'string',
        description: 'INSEE code'
      },
      type: {
        type: 'string',
        description: 'territory type (country, dep, reg, aom, com)'
      }
    },
    response: {
      200: {
        type: 'object',
        description:'Informations about a territory',
        properties: {
          territory: {type:'string'},
          l_territory: {type:'string'},
          type: {type:'string'}
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
            intra_journeys: {type:'integer'},
            trips: {type:'integer'},
            passengers: {type:'integer'},
            has_incentive: {type:'integer'},
            distance: {type:'number'},
            duration: {type:'number'},
            occupation_rate: {type:'number'},
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

  static territoryBestTerritories = {
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
      },
      t2: {
        type: 'string',
        description: 'type of territory observed'
      },
    },
    response: {
      200: {
        type: 'array',
        items: {
          properties: {
            l_territory: {type:'string'},
            journeys: {type:'integer'}
          }
        }
      }
    }
  }

  static territoryJourneysByHours = {
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
            hour: {type:'integer'},
            journeys: {type:'integer'}
          }
        }
      }
    }
  }

  static territoryJourneysByDistance = {
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
            dist_classes: {type:'string'},
            journeys: {type:'integer'}
          }
        }
      }
    }
  }

  static territoryAom = {
    tags: ['territories'],
    querystring: {
      year: {
        type: 'string',
        description: 'Year (YYYY)'
      }
    },
    response: {
      200: {
        type: 'object',
        description:'Geojson des aom',
        properties: {
          type: {type:'string'},
          features: {
            type:'array',
            items: {
              properties: {
                type: {type:'string'},
                geometry:{
                  type:'object',
                  properties:{
                    type: {type:'string'},
                    coordinates:{
                      type:'array',
                      items:{ type: ['array','number']}
                    }
                  }
                },
                properties: {
                  aom:{type:'string'},
                  l_aom:{type:'string'},
                }
              }
            }
          }
        }
      }
    }
  }
}