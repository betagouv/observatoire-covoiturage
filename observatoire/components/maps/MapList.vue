<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters" v-for="(content,index) of contents" :key="index">
      <MapsMapContent :content="content"/>
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