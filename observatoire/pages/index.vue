<template>
<div class="fr-container--fluid">
  <div class="fr-section--banner hero">
    <div class="fr-container home_header">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div v-if="lgAndAbove" class="fr-col-3">
          <div class="align-center">
            <img class="fr-responsive-img" src="/images/phare.svg" alt="observatoire"/>
          </div>
        </div>
        <div class="fr-col">
          <h1>Bienvenue sur le site de l'Observatoire national du covoiturage au quotidien<span v-if="lgAndAbove">*</span> !</h1>
          <p v-if="lgAndAbove">
            Le site de référence pour suivre l’évolution des pratiques du covoiturage courte distance.
            Notre mission est de collecter et diffuser les données ouvertes auprès des acteurs de la mobilité et de mesurer 
            l’impact des politiques publiques.<br/>
            <i>*Le covoiturage au quotidien concerne principalement des trajets de moins de 80 km. 
            Dans un premier temps, l'observatoire se concentre uniquement sur les données réelles enregistrées par les opérateurs du covoiturage 
            partenaires du Registre de Preuve de Covoiturage.</i>
          </p>
          
          <div class="fr-grid-row">
          <ul class="fr-btns-group fr-btns-group--inline-lg">
            <li>
              <NuxtLink to="/pages/qui-sommes-nous" class="fr-btn fr-btn--secondary">
                Qui sommes-nous ?
              </NuxtLink>
            </li>
            <li>
            <NuxtLink to="/cartes" class="fr-btn fr-btn--secondary">
              Consulter les cartes interactives
            </NuxtLink>
            </li>
            <li>
            <NuxtLink to="/dashboard" class="fr-btn fr-btn--secondary">
              Consulter le tableau de bord
            </NuxtLink>
            </li>
          </ul>
        </div>
        </div>
      </div>
    </div>
  </div>
  <div class="fr-section home-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList title="Les actualités du covoiturage au quotidien" :contents="actualites" :taxonomies="taxonomies" />
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
          <ContentList title="Ressources" :contents="ressources" :taxonomies="taxonomies" />
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
import { Component, mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../components/mixins/breakpoints'
import Indicators from '../components/Indicators.vue'
import ContentList from '../components/ContentList.vue'

@Component({
  components:{Indicators,ContentList}
})
export default class Home extends mixins(BreakpointsMixin){
  async asyncData({ $content }) {
    const perPage = 3
    const actualites = await $content('actualites')
    .only(['title', 'description', 'img', 'slug','categories','themes','dir','date'])
    .sortBy('date', 'desc')
    .limit(perPage)
    .fetch()

    const ressources = await $content('ressources')
    .only(['title', 'description', 'img', 'slug','categories','themes','dir','date'])
    .sortBy('date', 'desc')
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