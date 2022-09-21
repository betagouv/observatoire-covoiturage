export default class evolutionSchema {
  
  static evolMonthly = {
    tags: ['occupation'],
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
        description: 'type of selected territories'
      },
      code: {
        type: 'string',
        description: 'insee code of observed territory'
      },
    },
    response: {
      200: {
        type: 'array',
        description:'Trajets et taux d\'occupation mensuels pour le type de territoires selectionné (tout sens confondus) sur 12 mois',
        items: {
          properties: {
            year:{type:'integer'},
            month:{type:'integer'},
            journeys:{type:'integer'},
            passengers:{type:'integer'},
            distance:{type:'number'},
            duration:{type:'number'},
            trips:{type:'integer'},
            has_incentive:{type:'integer'},
            occupation_rate:{type:'number'},
          }
        }
      }
    }
  }
}