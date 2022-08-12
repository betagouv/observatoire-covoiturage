declare module fluxTypes {
  interface monthly {
    Querystring: {
      year:string,
      month:string,
      t?:string, //type de territoire selectionné
      code?:string, //code insee du territoire observé
      t2:string, //type du territoire observé
    }
  }
}

export default fluxTypes