declare module evolutionTypes {
  interface monthly {
    Querystring: {
      year:string,
      month:string,
      t?:string, //type de territoire selectionné
      code?:string, //code insee du territoire observé
    }
  }
}

export default evolutionTypes