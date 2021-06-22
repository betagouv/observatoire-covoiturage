<template>
  <nav role="navigation" class="fr-breadcrumb" aria-label="vous êtes ici :">
    <button class="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb">Voir le fil d’Ariane</button>
    <div class="fr-collapse" id="breadcrumb">
      <ol class="fr-breadcrumb__list">
          <li>
              <a class="fr-breadcrumb__link" href="/">Accueil</a>
          </li>
          <li>
            <NuxtLink :to="`/${type.slug}`" class="fr-breadcrumb__link">
              {{type.name}}
            </NuxtLink>
          </li>
          <li v-if="category">
            <NuxtLink :to="`/${type.slug}/${category.slug}`" class="fr-breadcrumb__link">
              {{category.name}}
            </NuxtLink>
          </li>
          <li  v-if="current">
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
  @Prop({ default:null }) category!: object
  @Prop({ default:null }) current!: string
}
</script>