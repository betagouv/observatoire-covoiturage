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
            <span v-if="categories && content.categories.length > 1">dans les catégories:</span>
            <span v-else-if="categories" >dans la catégorie:</span>
            <span v-for="(category,index) in content.categories" :key="index">
              <span v-if="categories && index != 0">, </span>
              <span v-if="categories">{{categories.find(c => c.slug === category).name}}</span>
            </span>
          </p>
          <h4 class="fr-card__title">
            <a :href="`${content.dir}/${content.categories[0]}/${content.slug}`" class="fr-card__link">
              {{ content.title }}
            </a>
          </h4>
          <p class="fr-card__desc">
            {{ content.description }}
          </p>
        </div>
        <div class="fr-card__img">
          <img :src="`/images/${content.img}`" class="fr-responsive-img" :alt="content.alt">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class ContentList extends Vue{
  @Prop({ default:null }) title!: string
  @Prop({ default:null }) contents!: object
  @Prop({ default:null }) categories!: object

  formatDate(date:string) {
    return new Date(date).toLocaleDateString('fr-FR')
  }

}
</script>