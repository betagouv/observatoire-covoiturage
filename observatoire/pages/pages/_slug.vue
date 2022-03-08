<template>
  <div class="fr-section">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <Breadcrumb :type="type" :current="page.title"/>
      </div>
      <div class="fr-col-lg-8 fr-col-offset-lg-2">
        <div class="fr-grid-row fr-grid-row--gutters">
          <article class="fr-col-12">
            <h1 class="h-text-center">{{ page.title }}</h1>
            <p class="fr-text--lead fr-text--alt">{{ page.description }}</p>
            <div class="fr-text--lg">
              <nuxt-content :document="page" />
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
                  <a class="fr-share__link fr-share__link--mail" :href="`mailto:?subject=${page.title}&body=${page.description} ${$config.url_app}${$route.path}`" title="Partager par email" target="_blank">Partager par email</a>
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
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Breadcrumb from '../../components/Breadcrumb.vue'

@Component({
  components:{Breadcrumb}
})
export default class Page extends Vue{
  type = {name:'Pages',slug:'pages'}
  async asyncData({ $content, params  }) {
    const page = await $content('pages', params.slug)
    .fetch()
    return { page }
  }
}
</script>