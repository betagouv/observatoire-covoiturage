<template>
<div class="fr-section">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <Breadcrumb :type="type" :taxonomy="taxonomies.categories[0]" :current="actualite.title"/>
      </div>
      <div class="fr-col-lg-8 fr-col-offset-lg-2">
        <div class="fr-grid-row fr-grid-row--gutters">
          <article class="fr-col-12">
            <h1 class="h-text-center">{{ actualite.title }}</h1>
            <div class="fr-text--xs single-meta">
              <span>Publié le {{ formatDate(actualite.createdAt) }} </span>
              <span v-if="actualite.categories">
                <span v-if="actualite.categories.length > 1">dans les catégories:</span>
                <span v-else>dans la catégorie:</span>
                <span v-for="(taxonomy,index) in actualite.categories" :key="index">
                  <span v-if="index != 0">, </span>
                  <span><a :href="`/actualites/categorie/${getTaxonomy(taxonomies.categories,taxonomy).slug}`">{{getTaxonomy(taxonomies.categories,taxonomy).name}}</a></span>
                </span>
              </span>
              <span v-if="actualite.categories && actualite.themes"> et </span>
              <span v-if="actualite.themes">
                <span v-if="actualite.themes.length > 1">dans les thèmes:</span>
                <span v-else>dans le thème:</span>
                <span v-for="(taxonomy,index) in actualite.themes" :key="index">
                  <span v-if="index != 0">, </span>
                  <span><a :href="`/actualites/theme/${getTaxonomy(taxonomies.themes,taxonomy).slug}`">{{getTaxonomy(taxonomies.themes,taxonomy).name}}</a></span>
                </span>
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
import { Component, mixins } from 'nuxt-property-decorator'
import ContentMixin from '../../../../components/mixins/content'

@Component
export default class SingleActualite extends mixins(ContentMixin){
  actualite: any
  head() {
    return { 
      title: '4TOTO',
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.actualite.description,
        }
      ]
    }
  }
  async asyncData({ $content, params }) {
    const actualite = await $content('actualites', params.slug)
    .where({categories:{$contains: params.category}})
    .fetch()
    
    const [prev, next] = await $content('actualites')
    .where({categories:{$contains: params.category}})
    .only(['title', 'slug'])
    .sortBy('createdAt', 'asc')
    .surround(params.slug)
    .fetch()

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .where({ slug: { $containsAny: actualite.categories } })
    .fetch()

    const themes = await $content('themes')
    .only(['name', 'slug'])
    .where({ slug: { $containsAny: actualite.themes } })
    .fetch()

    const taxonomies = {'categories':categories,'themes':themes}

    return { actualite, taxonomies, prev, next }
  }
}
</script>
