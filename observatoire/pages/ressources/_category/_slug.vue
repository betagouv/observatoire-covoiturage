<template>
<div class="fr-section">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <Breadcrumb :type="type" :category="categories[0]" :current="ressource.title"/>
      </div>
      <div class="fr-col-lg-8 fr-col-offset-lg-2">
        <div class="fr-grid-row fr-grid-row--gutters">
          <article class="fr-col-12">
            <h1 class="h-text-center">{{ ressource.title }}</h1>
            <div class="fr-text--xs single-meta">
              <span>Publié le {{ formatDate(ressource.createdAt) }} </span>
              <span v-if="categories && ressource.categories.length > 1">dans les catégories:</span>
              <span v-else-if="categories" >dans la catégorie:</span>
              <span v-for="(category,index) in ressource.categories" :key="index">
                <span v-if="categories && index != 0">, </span>
                <span v-if="categories">{{categories.find(c => c.slug === category).name}}</span>
              </span>
            </div>
            <p class="fr-text--lead fr-text--alt">{{ ressource.description }}</p>
            <figure v-if="ressource.img" class="fr-content-media fr-content-media--lg" role="group">
              <div class="fr-content-media__img">
                  <img :src="`/images/${ressource.img}`" :alt="ressource.alt">
              </div>
            </figure>
            <div class="fr-text--lg">
              <nuxt-content :document="ressource" />
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
  type = {name:'Ressources',slug:'ressources'}
  async asyncData({ $content, params }) {
    const ressource = await $content('ressources', params.slug)
    .where({categories:{$contains: params.category}})
    .fetch()

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .where({ slug: { $containsAny: ressource.categories } })
    .fetch()
    
    const [prev, next] = await $content('ressources')
    .where({categories:{$contains: params.category}})
    .only(['title', 'slug'])
    .sortBy('createdAt', 'asc')
    .surround(params.slug)
    .fetch()
    return { ressource, categories, prev, next }
  }

  formatDate(date:string) {
    return new Date(date).toLocaleDateString('fr-FR')
  }
}
</script>
