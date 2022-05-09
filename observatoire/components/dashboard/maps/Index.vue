<template>
  <section>
    <Occupation v-if="activeMap==='occupation'" :period=period :territory=territory />
    <Flux v-if="activeMap==='flux'" :period=period :territory=territory />
    <Aires v-if="activeMap==='aires'" :period=period :territory=territory />
  </section>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Aires from './Aires.vue'
import Flux from './Flux.vue'
import Occupation from './Occupation.vue'
import { MonthlyPeriodInterface, TerritoryInterface } from '../../interfaces/sidebar'

@Component({
  components:{
    Aires,
    Flux,
    Occupation,
  }
})
export default class MapIndex extends Vue{
  @Prop({ required: true }) activeMap!: string
  @Prop({ required: true }) period!: MonthlyPeriodInterface
  @Prop({ required: true }) territory!: TerritoryInterface
}
</script>
