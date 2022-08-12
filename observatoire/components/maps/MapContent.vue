<template>
  <div class="fr-col-12">
    <div class="fr-card fr-enlarge-link fr-card--horizontal">
      <div class="fr-card__body">
          <div class="fr-card__content">
            <h4 class="fr-card__title">
                <a :href="content.link" class="fr-card__link">{{content.title}}</a>
            </h4>
            <p class="fr-card__desc">
              <nuxt-content :document="content" />
            </p>
          </div>
      </div>
      <div class="fr-card__header">
          <div class="fr-card__img">
              <img class="fr-responsive-img" :src="'/images/cartes/'+content.img" alt=""/>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class MapContent extends Vue{
  @Prop({ default:null }) content!: Object
}
</script>