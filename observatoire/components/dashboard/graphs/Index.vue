<template>
  <section>
    <Journeys v-if="dashboard.activeGraph ==='journeys'" />
    <Trips v-if="dashboard.activeGraph ==='trips'" />
    <Occupation v-if="dashboard.activeGraph ==='occupation'" />
  </section>
</template>
 
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Journeys from './Journeys.vue'
import Trips from './Trips.vue'
import Occupation from './Occupation.vue'
import { mapState } from 'vuex'


@Component({
  components:{
    Journeys,
    Trips,
    Occupation,
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
