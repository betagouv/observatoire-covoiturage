<template>
<div class="fr-section">
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <Breadcrumb :category="categories[0]" :current="article.title"/>
      </div>
      <div class="fr-col-12">
        <article>
          <h1>{{ article.title }}</h1>
          <p>{{ article.description }}</p>
          <img :src="article.img" :alt="article.alt" />
          <nuxt-content :document="article" />
        </article>
      </div>
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
export default class SingleArticle extends Vue{
  async asyncData({ $content, params }) {
    const article = await $content('articles', params.slug)
    .where({categories:{$contains: params.category}})
    .fetch()

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .where({ slug: { $containsAny: article.categories } })
    .fetch()
    
    const [prev, next] = await $content('articles')
    .where({categories:{$contains: params.category}})
    .only(['title', 'slug'])
    .sortBy('createdAt', 'asc')
    .surround(params.slug)
    .fetch()
    return { article, categories, prev, next }
  }
}
</script>
