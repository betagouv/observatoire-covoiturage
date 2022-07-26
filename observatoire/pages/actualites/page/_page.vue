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
import Breadcrumb from '../../../components/Breadcrumb.vue'
import ContentList from '../../../components/ContentList.vue'
import Pagination from '../../../components/Pagination.vue'

@Component({
  components:{Breadcrumb,ContentList,Pagination}
})
export default class Actualites extends Vue{
  title='Actualités du covoiturage au quotidien'
  description=''
  currentPage:any
  $config:any
  $route:any
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
    .only(['title', 'description', 'img', 'slug','categories', 'themes', 'dir','date'])
    .sortBy('date', 'desc')
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
  head() {
    return {
      title: `${this.title} | Page ${this.currentPage}`,
      meta:[
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'og:url', property: "og:url", content: `${this.$config.url_app}${this.$route.path}` },
        { hid: 'og:title', property: "og:title", content: `${this.title} | Page ${this.currentPage}`},
        { hid: "og:description", property: "og:description", content: this.description},
        { hid: "twitter:url", name: "twitter:url", content: `${this.$config.url_app}${this.$route.path}`},
        { hid: "twitter:title", name: "twitter:title", content: `${this.title} | Page ${this.currentPage}`},
        { hid: "twitter:description", name: "twitter:description", content: this.description},
      ],
      link: [
        { hid: "canonical", rel: "canonical", href: `${this.$config.url_app}${this.$route.path}` }
      ]
    }
  }
}
</script>
