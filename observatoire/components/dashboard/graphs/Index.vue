<template>
  <section>
    <Journeys v-if="dashboard.period.year !==''" />
  </section>
</template>
 
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Journeys from './Journeys.vue'
import { mapState } from 'vuex'


@Component({
  components:{
    Journeys,
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
