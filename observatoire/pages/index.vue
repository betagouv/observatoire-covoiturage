<template>
<div class="fr-container--fluid">
  <div class="fr-section--banner hero">
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-4">
          <div class="align-center">
            <img class="fr-responsive-img" src="/images/phare.svg" alt="observatoire"/>
          </div>
        </div>
        <div class="fr-col-8">
          <h1>Bienvenue sur le site de l'Observatoire national du covoiturage du quotidien !</h1>
          <p>Ce site permet de suivre l’évolution des pratiques du covoiturage courte distance en analysant les données ouvertes produites sur le sujet afin de permettre aux territoires et aux citoyens d'être mieux informé.</p>
          <div class="fr-grid-row">
          <div class="fr-col-12">
              <NuxtLink to="/cartes" class="fr-btn fr-btn--secondary">
                Consulter l'atlas cartographique
              </NuxtLink>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
  <div class="fr-section home-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList title="A la une" :contents="actualites" :taxonomies="taxonomies" />
        </div>
      </div>
      <div class="fr-grid-row">
        <div class="fr-col-12 align-center">
            <NuxtLink to="/actualites" class="fr-btn fr-btn--secondary">
              Plus d'actualités
            </NuxtLink>
        </div>
      </div>
    </div>
  </div>
  <div class="fr-section--banner hero">
    <Indicators />
  </div>
  <div class="fr-section home-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList title="" :contents="ressources" :taxonomies="taxonomies" />
        </div>
      </div>
      <div class="fr-grid-row">
        <div class="fr-col-12 align-center">
            <NuxtLink to="/ressources" class="fr-btn fr-btn--secondary">
              Plus de ressources
            </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Home extends Vue{
  async asyncData({ $content }) {
    const perPage = 3
    const actualites = await $content('actualites')
    .only(['title', 'description', 'img', 'slug','categories','themes','dir','createdAt'])
    .sortBy('createdAt', 'asc')
    .limit(perPage)
    .fetch()

    const ressources = await $content('ressources')
    .only(['title', 'description', 'img', 'slug','categories','themes','dir','createdAt'])
    .sortBy('createdAt', 'asc')
    .limit(perPage)
    .fetch()

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .fetch()

    const themes = await $content('themes')
    .only(['name', 'slug'])
    .fetch()

    const taxonomies = {'categories':categories,'themes':themes}

    return { actualites, ressources, taxonomies }
  }
}
</script>