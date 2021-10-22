import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class ContentMixin extends Vue {
  
  public formatDate(date:string) {
    return new Date(date).toLocaleDateString('fr-FR')
  }

  public getTaxonomy(taxonomies:Array<{name:string,slug:string}>,taxonomy:string){
    return taxonomies.find(c => c.slug === taxonomy)
  }

  public shortString(string:string,length:number){
    if (string.length <= length) return string;
    return `${string.substr(0, string.lastIndexOf(' ', length))} ...`;
  }
}