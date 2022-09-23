export interface EvolInterface {
  year:number,
  month:number,
  journeys:number,
  passengers:number,
  distance:number,
  duration:number,
  trips:number,
  has_incentive:number,
  occupation_rate:number,
}

export interface JourneysByHoursInterface {
  hour:number,
  journeys:number,
}