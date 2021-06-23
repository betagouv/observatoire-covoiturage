<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <Breadcrumb :type="type" :current="`Page ${currentPage}`"/>
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList title="Actualités" :contents="ressources" :categories="categories" />
        </div>
        <div class="fr-col-12">
          <Pagination :currentPage="currentPage" :lastPage="lastPage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class RessourcesPage extends Vue{
  type = {name:'Ressources',slug:'ressources'}
  async asyncData({ $content, params }) {
    const perPage = 3
    const currentPage = parseInt(params.page)
    const allRessources = await $content('ressources').fetch()
    const totalRessources = allRessources.length
    const lastPage = Math.ceil(totalRessources / perPage)
    const skipNumber = () => {
      if (currentPage === 1) {
        return 0
      }
      return (currentPage - 1) * perPage
    }

    const ressources = await $content('ressources')
    .only(['title', 'description', 'img', 'slug','categories','dir','createdAt'])
    .sortBy('createdAt', 'asc')
    .limit(perPage)
    .skip(skipNumber())
    .fetch()

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .fetch()

    return { ressources, categories, currentPage, lastPage }
  }
}
</script>
