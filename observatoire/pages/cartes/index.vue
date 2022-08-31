<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
           <Breadcrumb :type="type"/>
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList :title="title" :contents="cartes" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Breadcrumb from '../../components/Breadcrumb.vue'
import ContentList from '../../components/ContentList.vue'

@Component({
  components:{Breadcrumb,ContentList}
})
export default class Cartes extends Vue{
  title='Cartes de l\'observatoire'
  description=''
  $config:any
  $route:any
  type = {name:'Cartes',slug:'cartes'}
  
  async asyncData({ $content, params, error }) {
    
    const cartes = await $content('cartes')
      .sortBy('date', 'desc')
      .fetch()

    return { cartes }
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
