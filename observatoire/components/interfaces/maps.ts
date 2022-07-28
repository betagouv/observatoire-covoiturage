export interface MapOptionsInterface {
  center:[number, number],
  style:string,
  zoom:number,
  zoomMobile?:number,
  controls?:boolean,
  attribution:boolean
  antialias:boolean
}

export interface MapAnalyseInterface {
  val:number,
  color:[number,number,number],
  width:number
}

export interface AiresData {
  id_lieu:string,
  nom_lieu:string,
  com_lieu:string,
  type:string,
  date_maj: string,
  nbre_pl?:number,
  nbre_pmr?:number,
  duree?:number,
  horaires?:string,
  proprio?:string,
  lumiere?:boolean,
  comm?:string,
  geom:{properties:{ type:string, coordinates:[number,number]}}
}

export interface OccupData {
  territory:string,
  l_territory:string,
  journeys:number,
  occupation_rate:number,
  geom:{properties:{ type:string, coordinates:[number,number]}}
}

export interface FluxData {
  ter_1:string,
  lng_1:number,
  lat_1:number,
  ter_2:string,
  lng_2:number,
  lat_2:number,
  passengers:number,
  distance:number,
}

export interface DensiteData {
  hex:string,
  count:number,
}
