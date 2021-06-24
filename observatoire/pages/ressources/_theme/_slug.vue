<template>
<div class="fr-section">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <Breadcrumb :type="type" :taxonomy="themes[0]" :current="ressource.title"/>
      </div>
      <div class="fr-col-lg-8 fr-col-offset-lg-2">
        <div class="fr-grid-row fr-grid-row--gutters">
          <article class="fr-col-12">
            <h1 class="h-text-center">{{ ressource.title }}</h1>
            <div class="fr-text--xs single-meta">
              <span>Publié le {{ formatDate(ressource.createdAt) }} </span>
              <span v-if="themes && ressource.themes.length > 1">dans les thèmes:</span>
              <span v-else-if="themes" >dans le thème:</span>
              <span v-for="(theme,index) in ressource.themes" :key="index">
                <span v-if="themes && index != 0">, </span>
                <span v-if="themes"><a :href="`/ressources/${getTaxonomy(themes,theme).slug}`">{{getTaxonomy(themes,theme).name}}</a></span>
              </span>
            </div>
            <p class="fr-text--lead fr-text--alt">{{ ressource.description }}</p>
            <figure v-if="ressource.img" class="fr-content-media fr-content-media--lg" role="group">
              <div class="fr-content-media__img">
                  <img :src="`${ressource.img}`" :alt="ressource.alt">
              </div>
              <figcaption v-if="ressource.legend" class="fr-content-media__caption">{{ressource.legend}}</figcaption>
            </figure>
            <div class="fr-text--lg">
              <nuxt-content :document="ressource" />
            </div>
            <div v-if="ressource.files" class="fr-callout fr-fi-download-line">
              <h4 v-if="ressource.files.length > 1" class="fr-callout__title">Téléchargez les fichiers</h4>
              <h4 v-else class="fr-callout__title">Téléchargez le fichier</h4>
              <ul class="fr-callout__text">
                <li v-for="(file,index) in ressource.files" :key="index"> 
                  <a :href="file.link" :alt="file.name" target="_blank" rel="noopener">
                    <span v-if="file.author">{{file.author}}</span> -
                    <span v-if="file.name">{{file.name}}</span> -
                    <span v-if="file.publication_date">{{file.publication_date}}</span>
                  </a>
                </li>
              </ul>
            </div>
          </article>
          <div class="fr-col-12">
            <Prev-next :prev="prev" :next="next" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>



<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class SingleRessource extends Vue{
  type = {name:'S\'informer',slug:'ressources'}
  async asyncData({ $content, params }) {
    const ressource = await $content('ressources', params.slug)
    .where({themes:{$contains: params.theme}})
    .fetch()

    const themes = await $content('themes')
    .only(['name', 'slug'])
    .where({ slug: { $containsAny: ressource.themes } })
    .fetch()
    
    const [prev, next] = await $content('ressources')
    .where({themes:{$contains: params.theme}})
    .only(['title', 'slug'])
    .sortBy('createdAt', 'asc')
    .surround(params.slug)
    .fetch()
    return { ressource, themes, prev, next }
  }

  formatDate(date:string) {
    return new Date(date).toLocaleDateString('fr-FR')
  }
  getTaxonomy(taxonomies:Array<{name:string,slug:string}>,taxonomy:string){
    return taxonomies.find(c => c.slug === taxonomy)
  }
}
</script>
