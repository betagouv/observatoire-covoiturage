<template>
  <div>
    <div class="fr-sidemenu__title">Affiner la période:</div>
    <o-field>
    <o-field label="Début" custom-class="is-small">
      <o-datepicker 
        label-position="on-border"
        v-model=selectedPeriod.start
        :min-date=minDate 
        :max-date=maxDate
        icon="calendar-today"
        trap-focus
      />
    </o-field>
    <o-field label="Fin" custom-class="is-small">
      <o-datepicker 
        v-model=selectedPeriod.end
        :min-date=minDate
        :max-date=maxDate
        icon="calendar-today"
        trap-focus
      />
    </o-field>
  </o-field>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { DashboardState } from '../../../../store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class DatepickerDensite extends Vue{
  dashboard!: DashboardState
  minDate = new Date('01/01/2020')
  maxDate = new Date()
  get selectedPeriod(){
    return {...this.dashboard.densitePeriod}
  }
  
  @Watch('selectedPeriod',{deep:true})
  onselectedPeriodChanged() {
    this.$store.commit('dashboard/DENSITE_PERIOD',this.selectedPeriod)
  }
  
}
</script>