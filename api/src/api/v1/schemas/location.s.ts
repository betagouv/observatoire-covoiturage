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
      },
      zoom: {
        type: 'number',
        description: 'Zoom index for hexagon layer'
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

  static lastRecordRpc = {
    tags: ['location'],
    response: {
      200: {
        type: 'object',
        description:'Return last date available in rpc table',
        properties: {
          date: {type:'string'}
        }
      }
    }
  }
}