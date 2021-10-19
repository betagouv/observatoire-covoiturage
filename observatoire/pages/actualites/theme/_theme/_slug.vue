<template>
<div class="fr-section">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <Breadcrumb :taxonomy="taxonomies.themes[0]" :current="actualite.title"/>
      </div>
      <div class="fr-col-lg-8 fr-col-offset-lg-2">
        <div class="fr-grid-row fr-grid-row--gutters">
          <article class="fr-col-12">
            <h1 class="h-text-center">{{ actualite.title }}</h1>
            <div class="fr-text--xs single-meta">
              <span>Publié le {{ formatDate(actualite.createdAt) }} </span>
              <span v-if="actualite.categories">
                <span v-if="actualite.categories.length > 1">dans les catégories:</span>
                <span v-else>dans la catégorie:</span>
                <span v-for="(taxonomy,index) in actualite.categories" :key="index">
                  <span v-if="index != 0">, </span>
                  <span><a :href="`/actualites/categorie/${getTaxonomy(taxonomies.categories,taxonomy).slug}`">{{getTaxonomy(taxonomies.categories,taxonomy).name}}</a></span>
                </span>
              </span>
              <span v-if="actualite.categories && actualite.themes"> et </span>
              <span v-if="actualite.themes">
                <span v-if="actualite.themes.length > 1">dans les thèmes:</span>
                <span v-else>dans le thème:</span>
                <span v-for="(taxonomy,index) in actualite.themes" :key="index">
                  <span v-if="index != 0">, </span>
                  <span><a :href="`/actualites/theme/${getTaxonomy(taxonomies.themes,taxonomy).slug}`">{{getTaxonomy(taxonomies.themes,taxonomy).name}}</a></span>
                </span>
              </span>
            </div>
            <p class="fr-text--lead fr-text--alt">{{ actualite.description }}</p>
            <figure v-if="actualite.img" class="fr-content-media fr-content-media--lg" role="group">
              <div class="fr-content-media__img">
                  <img :src="actualite.img" :alt="actualite.alt">
              </div>
              <figcaption v-if="actualite.legend" class="fr-content-media__caption">{{actualite.legend}}</figcaption>
            </figure>
            <div class="fr-text--lg">
              <nuxt-content :document="actualite" />
            </div>
            <div class="fr-share">
              <p class="fr-share__title">Partager la page</p>
              <ul class="fr-share__group">
                <li><a class="fr-share__link fr-share__link--facebook" title="Partager sur Facebook - ouvre une nouvelle fenêtre" :href="`https://www.facebook.com/sharer.php?u=${$config.url_app}${$route.path}`" target="_blank" rel="noopener" onclick="window.open(this.href,'Partager sur Facebook','toolbar=no,location=yes,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=450'); event.preventDefault();">Partager sur Facebook</a>
                </li>
                <li>
                  <!-- Les paramètres de la reqûete doivent être URI-encodés (ex: encodeURIComponent() en js) -->
                  <a class="fr-share__link fr-share__link--twitter" title="Partager sur Twitter - ouvre une nouvelle fenêtre" :href="`https://twitter.com/intent/tweet?url=${$config.url_app}${$route.path}`" target="_blank" rel="noopener" onclick="window.open(this.href,'Partager sur Twitter','toolbar=no,location=yes,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=420'); event.preventDefault();">Partager sur Twitter</a>
                </li>
                <li>
                  <a class="fr-share__link fr-share__link--linkedin" title="Partager sur LinkedIn - ouvre une nouvelle fenêtre" :href="`https://www.linkedin.com/shareArticle?url=${$config.url_app}${$route.path}`" target="_blank" rel="noopener" onclick="window.open(this.href,'Partager sur LinkedIn','toolbar=no,location=yes,status=no,menubar=no,scrollbars=yes,resizable=yes,width=550,height=550'); event.preventDefault();">Partager sur LinkedIn</a>
                </li>
                <li>
                  <a class="fr-share__link fr-share__link--mail" :href="`mailto:?subject=${actualite.title}&body=${actualite.description} ${$config.url_app}${$route.path}`" title="Partager par email" target="_blank">Partager par email</a>
                </li>
                <li>
                  <button class="fr-share__link fr-share__link--copy" title="Copier dans le presse-papier" onclick="navigator.clipboard.writeText(window.location);alert('Adresse copiée dans le presse papier.');">Copier dans le presse-papier</button>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </div>
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <PrevNext :prev="prev" :next="next" />
      </div>
    </div>
  </div>
</div>
</template>



<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ContentMixin from '../../../../components/mixins/content'
import Breadcrumb from '../../../../components/Breadcrumb.vue'
import PrevNext from '../../../../components/PrevNext.vue'

@Component({
  components:{Breadcrumb,PrevNext}
})
export default class SingleActualite extends mixins(ContentMixin){
  actualite:any
  $config:any
  $route:any

  async asyncData({ $content, params }) {
    const actualite = await $content('actualites', params.slug)
    .where({themes:{$contains: params.theme}})
    .fetch()
    
    const [prev, next] = await $content('actualites')
    .where({themes:{$contains: params.theme}})
    .only(['title', 'slug'])
    .sortBy('createdAt', 'asc')
    .surround(params.slug)
    .fetch()

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .where({ slug: { $containsAny: actualite.categories } })
    .fetch()

    const themes = await $content('themes')
    .only(['name', 'slug'])
    .where({ slug: { $containsAny: actualite.themes } })
    .fetch()

    const taxonomies = {'categories':categories,'themes':themes}

    return { actualite, taxonomies, prev, next }
  }

  head() {
    return {
      title: this.actualite.title,
      meta:[
        { hid: 'description', name: 'description', content: this.actualite.description },
        { hid: 'og:url', property: "og:url", content: `${this.$config.url_app}${this.$route.path}` },
        { hid: 'og:title', property: "og:title", content: this.actualite.title},
        { hid: "og:description", property: "og:description", content: this.actualite.description},
        { hid: "og:image", property: "og:image", content: this.actualite.img},
        { hid: "twitter:url", name: "twitter:url", content: `${this.$config.url_app}${this.$route.path}`},
        { hid: "twitter:title", name: "twitter:title", content: this.actualite.title},
        { hid: "twitter:description", name: "twitter:description", content: this.actualite.description},
        { hid: "twitter:image", name: "twitter:image", content: this.actualite.img }
      ],
      link: [
        { hid: "canonical", rel: "canonical", href: `${this.$config.url_app}${this.$route.path}` }
      ]
    }
  }
}
</script>
