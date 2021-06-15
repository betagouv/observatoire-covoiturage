<template>
<div class="fr-section">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <Breadcrumb :category="categories[0]" :current="actualite.title"/>
      </div>
      <div class="fr-col-lg-10 fr-col-offset-lg-1">
        <div class="fr-grid-row fr-grid-row--gutters">
          <article class="fr-col-12">
            <h1 class="h-text-center">{{ actualite.title }}</h1>
            <p>{{ actualite.description }}</p>
            <img :src="actualite.img" :alt="actualite.alt" />
            <nuxt-content :document="actualite" />
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
export default class SingleArticle extends Vue{
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
}
</script>
