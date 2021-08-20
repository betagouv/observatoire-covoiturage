declare module territoryTypes {
  interface list {
    Querystring: {
      year:string,
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