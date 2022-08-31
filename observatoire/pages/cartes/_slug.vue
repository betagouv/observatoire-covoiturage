<template>
<div class="fr-section">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <Breadcrumb :type="type" :current="carte.title"/>
      </div>
      <div class="fr-col-lg-8 fr-col-offset-lg-2">
        <div class="fr-grid-row fr-grid-row--gutters">
          <article class="fr-col-12">
            <h1 class="h-text-center">{{ carte.title }}</h1>
            <div class="fr-text--xs single-meta">
              <span>Publié le {{ formatDate(carte.date) }} </span>
            </div>
            <figure v-if="carte.img" class="fr-content-media fr-content-media--lg" role="group">
              <div class="fr-content-media__img">
                  <img :src="carte.img">
              </div>
            </figure>
            <div class="fr-text--lg">
              <nuxt-content :document="carte" />
            </div>
            <div v-if="carte.link" class="fr-callout">
              <button class="fr-btn" :href="carte.link">
                Voir la carte
              </button>
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
                  <a class="fr-share__link fr-share__link--mail" :href="`mailto:?subject=${carte.title}&body=${carte.description} ${$config.url_app}${$route.path}`" title="Partager par email" target="_blank">Partager par email</a>
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
import ContentMixin from '../../components/mixins/content'
import Breadcrumb from '../../components/Breadcrumb.vue'
import PrevNext from '../../components/PrevNext.vue'

@Component({
  components:{Breadcrumb,PrevNext}
})
export default class SingleCarte extends mixins(ContentMixin){
  carte:any
  $route: any
  $config: any
  taxonomies:any
  type = {name:'Cartes',slug:'cartes'}

  async asyncData({ $content, params }) {
    const carte = await $content('cartes', params.slug)
    .fetch()
    
    const [prev, next] = await $content('cartes')
    .only(['title', 'slug'])
    .sortBy('date', 'desc')
    .surround(params.slug)
    .fetch()

    return { carte, prev, next }
  }

  head() {
    return {
      title: this.carte.title,
      meta:[
        { hid: 'description', name: 'description', content: this.carte.description },
        { hid: 'og:url', property: "og:url", content: `${this.$config.url_app}${this.$route.path}` },
        { hid: 'og:title', property: "og:title", content: this.carte.title},
        { hid: "og:description", property: "og:description", content: this.carte.description},
        { hid: "og:image", property: "og:image", content: this.carte.img},
        { hid: "twitter:url", name: "twitter:url", content: `${this.$config.url_app}${this.$route.path}`},
        { hid: "twitter:title", name: "twitter:title", content: this.carte.title},
        { hid: "twitter:description", name: "twitter:description", content: this.carte.description},
        { hid: "twitter:image", name: "twitter:image", content: this.carte.img }
      ],
      link: [
        { hid: "canonical", rel: "canonical", href: `${this.$config.url_app}${this.$route.path}` }
      ]
    }
  }
  
}
</script>
