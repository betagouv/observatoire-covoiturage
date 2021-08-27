import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class ContentMixin extends Vue {
  
  public formatDate(date:string) {
    return new Date(date).toLocaleDateString('fr-FR')
  }

  public getTaxonomy(taxonomies:Array<{name:string,slug:string}>,taxonomy:string){
    return taxonomies.find(c => c.slug === taxonomy)
  }
}