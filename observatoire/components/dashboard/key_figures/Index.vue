<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-col-lg-7">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <div class="fr-tile">
            <div class="fr-tile__body">
              <h4>Principaux indicateurs</h4>
            </div>
          </div>
        </div>
      </div>
      <Indicators v-if="dashboard.period.year !==''" />
    </div>
    <div class="fr-col-12 fr-col-lg-5">
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