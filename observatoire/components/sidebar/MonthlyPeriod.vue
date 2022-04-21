<template>
  <ul class="fr-sidemenu__list">
    <div class="fr-sidemenu__title">Période (Mois) :</div>
    <li class="fr-sidemenu__item">
      <select v-model="selectedPeriod.month" class="fr-select" id="select-month" name="select-month">
        <option v-for="option in monthList" :value="option.id" :key="option.id">{{option.name}}</option>
      </select>
      <select v-model="selectedPeriod.year" class="fr-select" id="select-year" name="select-year">
        <option v-for="option in yearList" :value="option" :key="option">{{option}}</option>
      </select>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'nuxt-property-decorator'
@Component
export default class SidebarMonthlyPeriod extends Vue{
  @PropSync('period', { required: true, type: Object }) selectedPeriod!: MonthlyPeriodInterface
  get yearList(){
    return this.$store.state.helpers.yearList
  }
  get monthList(){
    return this.$store.state.helpers.monthList
  }
}
</script>