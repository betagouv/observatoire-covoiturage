export interface MapOptionsInterface {
  center:[number, number],
  style:string,
  zoom:number,
  zoomMobile?:number,
  controls?:boolean,
  attribution:boolean
}

export interface MapAnalyseInterface {
  val:number,
  color:[number,number,number],
  width:number
}