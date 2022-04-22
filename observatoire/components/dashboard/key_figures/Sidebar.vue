<template>
  <nav class="fr-sidemenu--full-border" :class="{'fr-p-1w': !lgAndAbove}" role="navigation" aria-label="Menu latéral">
    <div class="fr-sidemenu__inner">
      <SidebarTitle :title=title />
      <SidebarMonthlyPeriod :period=period />
      <SidebarSelectTerritory v-if="period.year" :year=period.year :territory=territory @selectedTerritory=emitTerritory />
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Watch, mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'
import SidebarTitle from '../../sidebar/Title.vue'
import SidebarMonthlyPeriod from '../../sidebar/MonthlyPeriod.vue'
import SidebarSelectTerritory from '../../sidebar/SelectTerritory.vue'
import { MonthlyPeriodInterface, TerritoryInterface } from '../../interfaces/sidebar'


@Component({
  components:{
    SidebarTitle,
    SidebarMonthlyPeriod,
    SidebarSelectTerritory,
  }
})
export default class KeySidebar extends mixins(BreakpointsMixin){
  @PropSync('period', { required: true, type: Object }) selectedPeriod!: MonthlyPeriodInterface
  @Prop({ required: true }) territory!: string
  selectedTerritory:TerritoryInterface | null = null

  get title(){
    let title = 'Situation nationale mensuelle'
    if (this.selectedTerritory && this.selectedTerritory.type !== 'country' ){
      title = 'Situation locale mensuelle'
    }
    return title
  }

  @Watch('selectedTerritory')
  onTerritoryChanged() {
    if(this.selectedTerritory){
      this.$emit('selectedTerritory', this.selectedTerritory)
    }
  }

   public emitTerritory(value:TerritoryInterface){
    this.selectedTerritory = value
  }
}
</script>