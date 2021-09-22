<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <Breadcrumb :type="type" :current="`Page ${currentPage}`"/>
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList title="Actualités" :contents="ressources" :taxonomies="taxonomies" />
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
import Breadcrumb from '../../../components/Breadcrumb.vue'
import ContentList from '../../../components/ContentList.vue'
import Pagination from '../../../components/Pagination.vue'

@Component({
  components:{Breadcrumb,ContentList,Pagination}
})
export default class RessourcesPage extends Vue{
  type = {name:'S\'informer',slug:'ressources'}
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
    .only(['title', 'description', 'img', 'slug','categories','themes','dir','createdAt'])
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

    return { ressources, taxonomies, currentPage, lastPage }
  }
}
</script>
