<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <Breadcrumb :current="`Page ${currentPage}`"/>
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList title="Actualités" :contents="actualites" :taxonomies="taxonomies" />
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
export default class Actualites extends Vue{
  async asyncData({ $content, params }) {
    const perPage = 9
    const currentPage = parseInt(params.page)
    const allActualites = await $content('actualites').fetch()
    const totalActualites = allActualites.length
    const lastPage = Math.ceil(totalActualites / perPage)
    const skipNumber = () => {
      if (currentPage === 1) {
        return 0
      }
      return (currentPage - 1) * perPage
    }

    const actualites = await $content('actualites')
    .only(['title', 'description', 'img', 'slug','categories', 'themes', 'dir','createdAt'])
    .sortBy('createdAt', 'asc')
    .limit(perPage)
    .skip(skipNumber())
    .fetch()

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .fetch()

    const themes = await $content('themes')
    .only(['name', 'slug'])
    .fetch()

    const taxonomies = {'categories':categories,'themes':themes}

    return { actualites, taxonomies, currentPage, lastPage }
  }
}
</script>
