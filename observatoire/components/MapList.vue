<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters" v-for="(content,index) of contents" :key="index">
      <div class="fr-col-12">
        <div class="fr-card fr-card--horizontal fr-enlarge-link">
          <div class="fr-card__body">
            <h4 class="fr-card__title">
                <a :href="content.link" class="fr-card__link">{{content.title}}</a>
            </h4>
            <p class="fr-card__desc">{{content.description}}</p>
          </div>
          <div class="fr-card__img">
            <img class="fr-responsive-img" :src="'/images/cartes/'+content.img" alt=""/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class MapList extends Vue{
  @Prop({ default:null }) contents!: object
  
}
</script>