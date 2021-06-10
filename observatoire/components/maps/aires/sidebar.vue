<template>
  <nav class="fr-sidemenu--full-border" :class="{'fr-p-1w': !lgAndAbove}" role="navigation" aria-label="Menu latéral">
    <div class="fr-sidemenu__inner">
      <ul class="fr-sidemenu__list">
        <div class="fr-sidemenu__title">Types d'aires de covoiturage :</div>
        <li class="fr-sidemenu__item filters">
          <b-field v-for="cat in this.switch" :key="cat.val">
            <b-switch size="is-small" v-model="cat.active">
              {{cat.val}}
            </b-switch>
          </b-field>
        </li>
      </ul>
      <p>{{allFeatures}} aires de covoiturage recensées (source: <a href="https://transport.data.gouv.fr/datasets/base-nationale-des-lieux-de-covoiturage/" target="_blank">transport.data.gouv.fr</a>)</p>
      <b-field>
        <button v-if="!lgAndAbove" class="fr-btn--menu fr-btn" title="Menu" @click="openSidebar">
          Fermer
        </button>
      </b-field>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component,mixins,Prop,Watch } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'

@Component
export default class AiresSidebar extends mixins(BreakpointsMixin){
  @Prop({ required: true }) switch!: Array<Object>
  @Prop({ required: true }) allFeatures!: string

  @Watch('allFeatures',{ deep: true })
  onAllFeaturesChanged() {
    this.$store.commit('screen/setSidebarOpen',false)
  }
}
</script>