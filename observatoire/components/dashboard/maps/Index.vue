<template>
  <section>
    <Occupation v-if="dashboard.activeMap==='occupation'" />
    <Flux v-if="dashboard.activeMap==='flux'" />
    <Aires v-if="dashboard.activeMap==='aires'" />
    <Densite v-if="dashboard.activeMap==='densite'" />
  </section>
</template>
 
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Flux from './Flux.vue'
import Densite from './Densite.vue'
import Occupation from './Occupation.vue'
import Aires from './Aires.vue'
import { mapState } from 'vuex'


@Component({
  components:{
    Flux,
    Densite,
    Occupation,
    Aires,
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

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
.o-tabs__content{
  padding: 0 !important;
}
.map_container {
  height: 70vh;
  #map{
    position:relative;
    height: 100%;
  }
}
.map-title{
  background-color: #000091;
  padding: 20px 5px;
   h5 {
    color: #ffffff;
    text-align: center;
    margin:0;
  }
}
</style>
