declare module locationTypes {
  interface periode {
    Querystring: {
      date_1:string,
      date_2:string,
      zoom:number,
      t?:string,
      code?:string,
    }
  }
}

export default locationTypes