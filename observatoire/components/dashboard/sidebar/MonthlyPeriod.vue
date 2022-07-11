<template>
  <ul class="fr-sidemenu__list">
    <div class="fr-sidemenu__title">Période (Mois) :</div>
    <li class="fr-sidemenu__item">
      <select v-model="month" class="fr-select" id="select-month" name="select-month">
        <option v-for="option in helpers.monthList" :value="option.id" :key="option.id">{{option.name}}</option>
      </select>
      <select v-model="year" class="fr-select" id="select-year" name="select-year">
        <option v-for="option in helpers.yearList" :value="option" :key="option">{{option}}</option>
      </select>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'


@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
      helpers: 'helpers',
    })
  }
})
export default class SidebarMonthlyPeriod extends Vue{
  dashboard!: DashboardState
  
  get month(){
    return this.dashboard.period.month
  }
  set month(value){
    this.$store.commit('dashboard/MONTH',value)
  }
  get year(){
    return this.dashboard.period.year
  }
  set year(value){
    this.$store.commit('dashboard/YEAR',value)
  }
  
}
</script>