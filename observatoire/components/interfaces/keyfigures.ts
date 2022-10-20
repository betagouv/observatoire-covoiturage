export interface IndicatorsInterface {
  year: string,
  month: string,
  territory:string,
  l_territory:string,
  passengers:number,
  journeys:number,
  intra_journeys:number,
  occupation_rate:number,
  trips:number,
  nb_aires:number,
  distance:number,
  duration:number,
}

export interface BestTripsInterface {
  l_territory_1: string,
  l_territory_2: string,
  journeys:number,
}

export interface BestTerritoriesInterface {
  l_territory: string,
  journeys:number,
}