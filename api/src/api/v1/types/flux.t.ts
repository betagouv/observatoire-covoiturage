declare module fluxTypes {
  interface monthly {
    Querystring: {
      t:string,
      year:string,
      month:string
    }
  }
}

export default fluxTypes