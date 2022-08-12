declare module territoryTypes {
  interface list {
    Querystring: {
      year:string,
    }
  }

  interface single {
    Querystring: {
      year:string,
      code:string,
      type:string,
    }
  }

  interface indicators {
    Querystring: {
      territory:string,
      t:string,
      year:string,
      month:string
    }
  }
}

export default territoryTypes