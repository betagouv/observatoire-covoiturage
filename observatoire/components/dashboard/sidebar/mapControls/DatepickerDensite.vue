<template>
  <div>
    
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { mapState, mapGetters } from 'vuex'
import { DashboardState } from '../../../../store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    }),
    ...mapGetters({
      getDensitePeriod:'dashboard'
    })
  }
})
export default class DatepickerDensite extends Vue{
  dashboard!: DashboardState
  minDate = new Date('01/01/2020')
  maxDate = new Date()

  /*@Watch('selectedPeriod',{deep:true})
  onselectedPeriodChanged( newVal: DashboardState["densitePeriod"], oldVal: DashboardState["densitePeriod"] ) {
    if(oldVal !== {start: new Date(), end: new Date()}){
      this.$store.commit('dashboard/DENSITE_PERIOD',this.selectedPeriod)
    }
  }*/


  
  
}
</script>