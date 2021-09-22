export const state = () => ({
  yearList:['2021','2020'],
  monthList:[
    {id:'01',name:'Janvier'},
    {id:'02',name:'Février'},
    {id:'03',name:'Mars'},
    {id:'04',name:'Avril'},
    {id:'05',name:'Mai'},
    {id:'06',name:'Juin'},
    {id:'07',name:'Juillet'},
    {id:'08',name:'Août'},
    {id:'09',name:'Septembre'},
    {id:'10',name:'Octobre'},
    {id:'11',name:'Novembre'},
    {id:'12',name:'Décembre'}
  ],
  territories:[
    {type:'com',name:'Communes'},
    {type:'epci',name:'EPCI'},
    {type:'dep',name:'Départements'},
    {type:'reg',name:'Régions'},
    {type:'country',name:'Pays'}
  ]
})