<template>
<div class="fr-section">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <Breadcrumb :type="type" :taxonomy="taxonomies.categories[0]" :current="ressource.title"/>
      </div>
      <div class="fr-col-lg-8 fr-col-offset-lg-2">
        <div class="fr-grid-row fr-grid-row--gutters">
          <article class="fr-col-12">
            <h1 class="h-text-center">{{ ressource.title }}</h1>
            <div class="fr-text--xs single-meta">
              <span>Publié le {{ formatDate(ressource.createdAt) }} </span>
              <span v-if="ressource.categories">
                <span v-if="ressource.categories.length > 1">dans les catégories:</span>
                <span v-else>dans la catégorie:</span>
                <span v-for="(taxonomy,index) in ressource.categories" :key="index">
                  <span v-if="index != 0">, </span>
                  <span><a :href="`/ressources/categorie/${getTaxonomy(taxonomies.categories,taxonomy).slug}`">{{getTaxonomy(taxonomies.categories,taxonomy).name}}</a></span>
                </span>
              </span>
              <span v-if="ressource.categories && ressource.themes"> et </span>
              <span v-if="ressource.themes">
                <span v-if="ressource.themes.length > 1">dans les thèmes:</span>
                <span v-else>dans le thème:</span>
                <span v-for="(taxonomy,index) in ressource.themes" :key="index">
                  <span v-if="index != 0">, </span>
                  <span><a :href="`/ressources/theme/${getTaxonomy(taxonomies.themes,taxonomy).slug}`">{{getTaxonomy(taxonomies.themes,taxonomy).name}}</a></span>
                </span>
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
import { Component, mixins } from 'nuxt-property-decorator'
import ContentMixin from '../../../../components/mixins/content'

@Component
export default class SingleRessource extends mixins(ContentMixin){
  type = {name:'S\'informer',slug:'ressources'}
  async asyncData({ $content, params }) {
    const ressource = await $content('ressources', params.slug)
    .where({categories:{$contains: params.category}})
    .fetch()
    
    const [prev, next] = await $content('ressources')
    .where({categories:{$contains: params.category}})
    .only(['title', 'slug'])
    .sortBy('createdAt', 'asc')
    .surround(params.slug)
    .fetch()

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .where({ slug: { $containsAny: ressource.categories } })
    .fetch()

    const themes = await $content('themes')
    .only(['name', 'slug'])
    .where({ slug: { $containsAny: ressource.themes } })
    .fetch()

    const taxonomies = {'categories':categories,'themes':themes}

    return { ressource, prev, next, taxonomies }
  }
}
</script>
