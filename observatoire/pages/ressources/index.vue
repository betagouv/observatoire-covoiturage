<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <Breadcrumb :type="type" />
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList title="S'informer" :contents="ressources" :taxonomies="taxonomies" />
        </div>
        <div class="fr-col-12">
          <Pagination :lastPage="lastPage" :type="type.slug"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Breadcrumb from '../../components/Breadcrumb.vue'
import ContentList from '../../components/ContentList.vue'
import Pagination from '../../components/Pagination.vue'

@Component({
  components:{Breadcrumb,ContentList,Pagination}
})
export default class Ressources extends Vue{
  type = {name:'S\'informer',slug:'ressources'}
  title='Ressources du covoiturage au quotidien'
  description=''
  $config:any
  $route:any

  async asyncData({ $content }) {
    const perPage = 9
    const ressources = await $content('ressources')
    .only(['title', 'description', 'img', 'slug','categories','themes','dir','createdAt'])
    .sortBy('createdAt', 'asc')
    .limit(perPage)
    .fetch()

    const allRessources = await $content('ressources').fetch()
    const totalRessources = allRessources.length
    const lastPage = Math.ceil(totalRessources / perPage)

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .fetch()

    const themes = await $content('themes')
    .only(['name', 'slug'])
    .fetch()

    const taxonomies = {'categories':categories,'themes':themes}

    return { ressources, taxonomies , lastPage }
  }
  head() {
    return {
      title: this.title,
      meta:[
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'og:url', property: "og:url", content: `${this.$config.url_app}${this.$route.path}` },
        { hid: 'og:title', property: "og:title", content: this.title},
        { hid: "og:description", property: "og:description", content: this.description},
        { hid: "twitter:url", name: "twitter:url", content: `${this.$config.url_app}${this.$route.path}`},
        { hid: "twitter:title", name: "twitter:title", content: this.title},
        { hid: "twitter:description", name: "twitter:description", content: this.description},
      ],
      link: [
        { hid: "canonical", rel: "canonical", href: `${this.$config.url_app}${this.$route.path}` }
      ]
    }
  }
}
</script>
