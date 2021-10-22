<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <Breadcrumb />
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList :title="title" :contents="pages" />
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
import Breadcrumb from '../../components/Breadcrumb.vue'
import ContentList from '../../components/ContentList.vue'
import Pagination from '../../components/Pagination.vue'


@Component({
  components:{Breadcrumb,ContentList,Pagination}
})
export default class Pages extends Vue{
  title='Pages'
  description=''
  async asyncData({ $content }) {
    const perPage = 9
    const pages = await $content('pages')
    .only(['title', 'description', 'img', 'slug','dir','createdAt'])
    .sortBy('createdAt', 'asc')
    .limit(perPage)
    .fetch()

    const allPages = await $content('pages').fetch()
    const totalPages = allPages.length
    const lastPage = Math.ceil(totalPages / perPage)
    return { pages, lastPage }
  }
  head({ $config, $route }) {
    return {
      title: this.title,
      meta:[
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'og:url', property: "og:url", content: `${$config.url_app}${$route.path}` },
        { hid: 'og:title', property: "og:title", content: this.title},
        { hid: "og:description", property: "og:description", content: this.description},
        { hid: "twitter:url", name: "twitter:url", content: `${$config.url_app}${$route.path}`},
        { hid: "twitter:title", name: "twitter:title", content: this.title},
        { hid: "twitter:description", name: "twitter:description", content: this.description},
      ],
      link: [
        { hid: "canonical", rel: "canonical", href: `${$config.url_app}${$route.path}` }
      ]
    }
  }
}
</script>
