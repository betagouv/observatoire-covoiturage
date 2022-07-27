<template>
  <div>
    <label class="fr-sidemenu__title">
      Affiner la période:
    </label>
    <o-field>
      <o-field label="Début" custom-class="is-small">
        <o-datepicker 
          label-position="on-border"
          v-model=startPeriod
          :min-date=minDate 
          :max-date=maxDate
          icon="calendar-today"
          trap-focus
        />
      </o-field>
      <o-field label="Fin" custom-class="is-small">
        <o-datepicker 
          v-model=endPeriod
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
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { DashboardState } from '../../../../store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    }),
  }
})
export default class DatepickerDensite extends Vue{
  dashboard!: DashboardState
  minDate = new Date('01/01/2020')
  maxDate = new Date()

  get startPeriod(){
    return this.dashboard.densitePeriod.start
  }

  set startPeriod(value){
    this.$store.commit('dashboard/DENSITE_PERIOD_START',value)
  }

  get endPeriod(){
    return this.dashboard.densitePeriod.end
  }

  set endPeriod(value){
    this.$store.commit('dashboard/DENSITE_PERIOD_END',value)
  }  
}
</script>