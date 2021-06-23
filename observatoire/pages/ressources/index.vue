<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <Breadcrumb :type="type" />
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList title="Ressources" :contents="ressources" :categories="categories" />
        </div>
        <div class="fr-col-12">
          <Pagination :lastPage="lastPage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Ressources extends Vue{
  type = {name:'Ressources',slug:'ressources'}

  async asyncData({ $content }) {
    const perPage = 3
    const ressources = await $content('ressources')
    .only(['title', 'description', 'img', 'slug','categories','dir','createdAt'])
    .sortBy('createdAt', 'asc')
    .limit(perPage)
    .fetch()

    const allRessources = await $content('ressources').fetch()
    const totalRessources = allRessources.length
    const lastPage = Math.ceil(totalRessources / perPage)

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .fetch()

    return { ressources, categories, lastPage }
  }
}
</script>
