<template>
  <section>
    <Journeys v-if="dashboard.activeGraph ==='journeys'" />
    <Trips v-if="dashboard.activeGraph ==='trips'" />
    <Occupation v-if="dashboard.activeGraph ==='occupation'" />
    <Distance v-if="dashboard.activeGraph ==='distance'" />
    <JourneysByHours v-if="dashboard.activeGraph ==='journeys_by_hours'" />
    <NewDrivers v-if="dashboard.activeGraph ==='new_drivers'" />
  </section>
</template>
 
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Journeys from './Journeys.vue'
import Trips from './Trips.vue'
import Occupation from './Occupation.vue'
import Distance from './Distance.vue'
import JourneysByHours from './JourneysByHours.vue'
import NewDrivers from './NewDrivers.vue'
import { mapState } from 'vuex'


@Component({
  components:{
    Journeys,
    Trips,
    Occupation,
    Distance,
    JourneysByHours,
    NewDrivers,
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class GraphIndex extends Vue{
  
}
</script>
