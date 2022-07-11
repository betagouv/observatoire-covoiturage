<template>
  <section>
    <Occupation v-if="dashboard.activeMap==='occupation'" />
    <Flux v-if="dashboard.activeMap==='flux'" />
    <Aires v-if="dashboard.activeMap==='aires'" />
  </section>
</template>
 
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Aires from './Aires.vue'
import Flux from './Flux.vue'
import Occupation from './Occupation.vue'
import { mapState } from 'vuex'


@Component({
  components:{
    Aires,
    Flux,
    Occupation,
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class MapIndex extends Vue{
}
</script>
