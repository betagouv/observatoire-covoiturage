<template>
  <div class="controls" v-if="edit">
    <o-field grouped>
      <select v-model="month" class="fr-select" id="select-month" name="select-month">
        <option v-for="option in helpers.monthList" :value="option.id" :key="option.id">{{option.name}}</option>
      </select>
      <select v-model="year" class="fr-select" id="select-year" name="select-year">
        <option v-for="option in helpers.yearList" :value="option" :key="option">{{option}}</option>
      </select>
      <o-button @click="edit=!edit" class="fr-btn" title="Label bouton">
        <i class="mdi mdi-close-circle-outline mdi-22px"></i>
      </o-button>
    </o-field>
  </div>
  <div class="controls" v-else>
    <h4>
      Période : {{monthName}} {{dashboard.period.year}} 
      <o-button @click="edition" class="fr-btn" title="Label bouton">
        <i class="mdi mdi-pencil mdi-22px"></i>
      </o-button>
    </h4>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'
import { helpersState } from '../../../store/helpers'


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
  helpers!: helpersState
  edit = false
  
  get month(){
    return this.dashboard.period.month
  }
  set month(value){
    this.$store.commit('dashboard/MONTH',value)
    this.edit = false
  }
  get monthName(){
    const month = this.helpers.monthList.find(d => d.id === Number(this.dashboard.period.month))
    if(month){
      return month.name
    }
  }
  get year(){
    return this.dashboard.period.year
  }
  set year(value){
    this.$store.commit('dashboard/YEAR',value)
    this.edit = false
  }

  public edition(){
    this.edit = true
  }
  
}
</script>