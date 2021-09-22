<template>
  <div class="fr-container--fluid">
    <div class="fr-section--banner hero">
      <div class="fr-container">
        <Indicators />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Indicators from '../components/Indicators.vue'

@Component({
  components:{Indicators}
})
export default class Dashboard extends Vue{
}
</script>