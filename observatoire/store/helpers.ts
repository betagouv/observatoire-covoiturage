export const state = () => ({
  yearList:['2022','2021','2020'],
  monthList:[
    {id:1,name:'Janvier'},
    {id:2,name:'Février'},
    {id:3,name:'Mars'},
    {id:4,name:'Avril'},
    {id:5,name:'Mai'},
    {id:6,name:'Juin'},
    {id:7,name:'Juillet'},
    {id:8,name:'Août'},
    {id:9,name:'Septembre'},
    {id:10,name:'Octobre'},
    {id:11,name:'Novembre'},
    {id:12,name:'Décembre'}
  ],
  territories:[
    {type:'com',name:'Communes'},
    {type:'epci',name:'EPCI'},
    {type:'aom',name:'AOM'},
    {type:'dep',name:'Départements'},
    {type:'reg',name:'Régions'},
    {type:'country',name:'Pays'}
  ],
  mapList:[
    {id:'flux',name:'Flux mensuels de passagers entre territoires'},
    {id:'densite',name:'Densité de trajets dans un maillage hexagonale'},
    {id:'occupation',name:'Taux d\'occupation des véhicules partagés et volume de trajets par territoire'},
    {id:'aires',name:'Aires de covoiturage'},
  ],
})

export type helpersState = ReturnType<typeof state>