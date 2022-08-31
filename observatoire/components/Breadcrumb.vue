<template>
  <nav role="navigation" class="fr-breadcrumb" aria-label="vous êtes ici :">
    <button class="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb">Voir le fil d’Ariane</button>
    <div class="fr-collapse" id="breadcrumb">
      <ol class="fr-breadcrumb__list">
          <li>
              <NuxtLink class="fr-breadcrumb__link" to="/">Accueil</NuxtLink>
          </li>
          <li v-if="taxonomy | current">
            <NuxtLink :to="`/${type.slug}`" class="fr-breadcrumb__link">
              {{type.name}}
            </NuxtLink>
          </li>
          <li v-else>
            <a class="fr-breadcrumb__link" aria-current="page">{{type.name}}</a>
          </li>
          <li v-if="taxonomy">
            <NuxtLink  v-if="$route.path.indexOf('categorie') >= 0" :to="`/${type.slug}/categorie/${taxonomy.slug}`" class="fr-breadcrumb__link">
              {{taxonomy.name}}
            </NuxtLink>
            <NuxtLink v-else :to="`/${type.slug}/theme/${taxonomy.slug}`" class="fr-breadcrumb__link">
              {{taxonomy.name}}
            </NuxtLink>
          </li>
          <li v-if="current">
            <a class="fr-breadcrumb__link" aria-current="page">{{current}}</a>
          </li>
      </ol>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class Breadcrumb extends Vue{
  @Prop( {default() { return {name:'Actualités',slug:'actualites'} }}) type!: object
  @Prop({ default:null }) taxonomy!: object
  @Prop({ default:null }) current!: string
}
</script>