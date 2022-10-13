<template>
  <section>
    <Journeys v-if="dashboard.activeGraph ==='journeys'" />
    <Trips v-if="dashboard.activeGraph ==='trips'" />
    <Occupation v-if="dashboard.activeGraph ==='occupation'" />
    <Distance v-if="dashboard.activeGraph ==='distance'" />
    <JourneysByHours v-if="dashboard.activeGraph ==='journeys_by_hours'" />
    <NewCovoit v-if="dashboard.activeGraph ==='new_covoit'" />
  </section>
</template>
 
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Journeys from './Journeys.vue'
import Trips from './Trips.vue'
import Occupation from './Occupation.vue'
import Distance from './Distance.vue'
import JourneysByHours from './JourneysByHours.vue'
import NewCovoit from './NewCovoit.vue'
import { mapState } from 'vuex'
import { DashboardState } from 'store/dashboard'


@Component({
  components:{
    Journeys,
    Trips,
    Occupation,
    Distance,
    JourneysByHours,
    NewCovoit,
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class GraphIndex extends Vue{
  dashboard!: DashboardState
}
</script>
