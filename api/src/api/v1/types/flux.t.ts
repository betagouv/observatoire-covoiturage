declare module fluxTypes {
  interface monthly {
    Querystring: {
      year:string,
      month:string,
      t:string,
      code?:string,
    }
  }
}

export default fluxTypes