<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters" v-for="(content,index) of contents" :key="index">
      <MapContent :content="content"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import MapContent from './MapContent.vue'

@Component({
  components:{MapContent}
})
export default class MapList extends Vue{
  @Prop({ default:null }) contents!: object
  
}
</script>