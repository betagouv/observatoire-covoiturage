<template>
<div class="fr-section">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <Breadcrumb :taxonomy="categories[0]" :current="actualite.title"/>
      </div>
      <div class="fr-col-lg-8 fr-col-offset-lg-2">
        <div class="fr-grid-row fr-grid-row--gutters">
          <article class="fr-col-12">
            <h1 class="h-text-center">{{ actualite.title }}</h1>
            <div class="fr-text--xs single-meta">
              <span>Publié le {{ formatDate(actualite.createdAt) }} </span>
              <span v-if="categories && actualite.categories.length > 1">dans les catégories:</span>
              <span v-else-if="categories" >dans la catégorie:</span>
              <span v-for="(category,index) in actualite.categories" :key="index">
                <span v-if="categories && index != 0">, </span>
                <span v-if="categories"><a :href="`/actualites/${getTaxonomy(categories,category).slug}`">{{getTaxonomy(categories,category).name}}</a></span>
              </span>
            </div>
            <p class="fr-text--lead fr-text--alt">{{ actualite.description }}</p>
            <figure v-if="actualite.img" class="fr-content-media fr-content-media--lg" role="group">
              <div class="fr-content-media__img">
                  <img :src="`/images/${actualite.img}`" :alt="actualite.alt">
              </div>
              <figcaption v-if="actualite.legend" class="fr-content-media__caption">{{actualite.legend}}</figcaption>
            </figure>
            <div class="fr-text--lg">
              <nuxt-content :document="actualite" />
            </div>
          </article>
        </div>
      </div>
    </div>
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <Prev-next :prev="prev" :next="next" />
      </div>
    </div>
  </div>
</div>
</template>



<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class SingleActualite extends Vue{
  async asyncData({ $content, params }) {
    const actualite = await $content('actualites', params.slug)
    .where({categories:{$contains: params.category}})
    .fetch()

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .where({ slug: { $containsAny: actualite.categories } })
    .fetch()
    
    const [prev, next] = await $content('actualites')
    .where({categories:{$contains: params.category}})
    .only(['title', 'slug'])
    .sortBy('createdAt', 'asc')
    .surround(params.slug)
    .fetch()
    return { actualite, categories, prev, next }
  }

  formatDate(date:string) {
    return new Date(date).toLocaleDateString('fr-FR')
  }

  getTaxonomy(taxonomies:Array<{name:string,slug:string}>,taxonomy:string){
    return taxonomies.find(c => c.slug === taxonomy)
  }
}
</script>
