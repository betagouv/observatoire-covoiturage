<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
           <Breadcrumb :current="theme[0].name"/>
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList :title="`Actualités sur le thème : ${theme[0].name}`" :contents="actualites" :taxonomies="taxonomies"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Breadcrumb from '../../../../components/Breadcrumb.vue'
import ContentList from '../../../../components/ContentList.vue'

@Component({
  components:{Breadcrumb,ContentList}
})
export default class ActualitesCategory extends Vue{
  title='Actualités du covoiturage au quotidien'
  description=''
  $route:any
  async asyncData({ $content, params, error }) {
    const theme = await $content('themes')
    .only(['name', 'slug'])
    .where({ slug: { $eq: params.theme } })
    .fetch()

    const actualites = await $content('actualites')
      .where({themes:{$contains: params.theme}})
      .only(['title', 'description', 'img', 'slug','categories','themes','dir','date'])
      .sortBy('date', 'desc')
      .fetch()

    if (!actualites.length) {
      return error({ statusCode: 404, message: "La catégorie que vous recherchez est vide ou n'existe pas." });
    }

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .fetch()

    const themes = await $content('themes')
    .only(['name', 'slug'])
    .fetch()

    const taxonomies = {'categories':categories,'themes':themes}

    return { theme, actualites, taxonomies }
  }
  head() {
    return {
      title: this.title,
      meta:[
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'og:url', property: "og:url", content: `${this.$store.state.env.url_app}${this.$route.path}` },
        { hid: 'og:title', property: "og:title", content: this.title},
        { hid: "og:description", property: "og:description", content: this.description},
        { hid: "twitter:url", name: "twitter:url", content: `${this.$store.state.env.url_app}${this.$route.path}`},
        { hid: "twitter:title", name: "twitter:title", content: this.title},
        { hid: "twitter:description", name: "twitter:description", content: this.description},
      ],
      link: [
        { hid: "canonical", rel: "canonical", href: `${this.$store.state.env.url_app}${this.$route.path}` }
      ]
    }
  }
}
</script>
