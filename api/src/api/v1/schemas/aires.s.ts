export default class airesSchema {
  
  static all = {
    tags: ['aires'],
    response: {
      200: {
        type: 'array',
        description:'Toutes les aires de covoiturage',
        items: {
          properties: {
            id_lieu: {type:'string'},
            ad_lieu: {type:'string'},
            com_lieu:{type:'string'},
            type:{type:'string'},
            date_maj: {type:'string'},
            nbre_pl: {type:'integer',nullable: true},
            nbre_pmr:{type:'integer',nullable: true},
            duree:{type:'integer',nullable: true},
            horaires:{type:'string',nullable: true},
            proprio:{type:'string',nullable: true},
            lumiere:{type:'boolean',nullable: true},
            comm:{type:'string',nullable: true},
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
