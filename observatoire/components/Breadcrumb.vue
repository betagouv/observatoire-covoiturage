<template>
  <nav role="navigation" class="fr-breadcrumb" aria-label="vous êtes ici :">
    <button class="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb">Voir le fil d’Ariane</button>
    <div class="fr-collapse" id="breadcrumb">
      <ol class="fr-breadcrumb__list">
          <li>
              <a class="fr-breadcrumb__link" href="/">Accueil</a>
          </li>
          <li v-if="taxonomy || current">
            <a :href="`/${type.slug}`" class="fr-breadcrumb__link">
              {{type.name}}
            </a>
          </li>
          <li v-else>
            <a class="fr-breadcrumb__link" aria-current="page">{{type.name}}</a>
          </li>
          <li v-if="taxonomy">
            <a  v-if="taxonomy.path.indexOf('categories') >= 0" :href="`/${type.slug}/categorie/${taxonomy.slug}`" class="fr-breadcrumb__link">
              {{taxonomy.name}}
            </a>
            <a v-else :href="`/${type.slug}/theme/${taxonomy.slug}`" class="fr-breadcrumb__link">
              {{taxonomy.name}}
            </a>
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
  @Prop({ default:null }) taxonomy!: object
  @Prop({ default:null }) current!: string
}
</script>