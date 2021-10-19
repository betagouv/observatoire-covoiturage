<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <h1 class="h-text-center">{{title}}</h1>
    </div>
    <div class="fr-col-md-4" v-for="content of contents" :key="content.slug">
      <div class="fr-card fr-enlarge-link">
        <div class="fr-card__body">
          <p class="fr-card__detail">
            <span>Publié le {{ formatDate(content.createdAt) }} </span>
            <span v-if="taxonomies">
              <span v-if="content.categories && content.categories.length > 1">dans les catégories:</span>
              <span v-else-if="content.categories" >dans la catégorie:</span>
              <span v-for="(taxonomy,index) in content.categories" :key="index">
                <span v-if="content.categories && index != 0">, </span>
                <span v-if="getTaxonomy(taxonomies.categories,taxonomy)">{{getTaxonomy(taxonomies.categories,taxonomy).name}}</span>
              </span>
              <span v-if="content.categories && content.themes"> et </span>
              <span v-if="content.themes && content.themes.length > 1">dans les thèmes:</span>
              <span v-else-if="content.themes" >dans le thème:</span>
              <span v-for="(taxonomy,index) in content.themes" :key="index">
                <span v-if="content.themes && index != 0">, </span>
                <span v-if="getTaxonomy(taxonomies.themes,taxonomy)">{{getTaxonomy(taxonomies.themes,taxonomy).name}}</span>
              </span>
            </span>
          </p>
          <h4 class="fr-card__title">
            <a v-if="$route.path.indexOf('categorie') >= 0" :href="`${content.dir}/categorie/${content.categories[0]}/${content.slug}`" class="fr-card__link">
              {{ content.title }}
            </a>
            <a v-else :href="`${content.dir}/theme/${content.themes[0]}/${content.slug}`" class="fr-card__link">
              {{ content.title }}
            </a>
          </h4>
          <p class="fr-card__desc">
            {{ content.description }}
          </p>
        </div>
        <div class="fr-card__img">
          <img :src="content.img" class="fr-responsive-img" :alt="content.alt">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import ContentMixin from '../components/mixins/content'

@Component
export default class ContentList extends mixins(ContentMixin){
  @Prop({ default:null }) title!: string
  @Prop({ default:null }) contents!: object
  @Prop({ default:null }) taxonomies!: object

  formatDate(date:string) {
    return new Date(date).toLocaleDateString('fr-FR')
  }
}
</script>