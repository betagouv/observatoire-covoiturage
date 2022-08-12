<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-col-lg-8">
      <Indicators v-if="dashboard.period.year !==''" />
    </div>
    <div class="fr-col-12 fr-col-lg-4">
      <BestTrips v-if="dashboard.period.year !==''" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Indicators from './Indicators.vue'
import BestTrips from './BestTrips.vue'
import { mapState } from 'vuex'
@Component({
  components:{
    Indicators,
    BestTrips,
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class KeyFiguresIndex extends Vue{
}
</script>