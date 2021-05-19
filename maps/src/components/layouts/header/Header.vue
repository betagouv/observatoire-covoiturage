<template>
  <header role="banner" class="fr-header">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div  class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo">
                  Ministère<br />
                  de la transition<br />
                  écologique
                </p>
              </div>
              <div class="fr-header__operator">
                <a href="/" title="Observatoire du covoiturage au quotidien - Ministère de la transition écologique">
                  <p class="fr-header__service-title">Observatoire du covoiturage au quotidien</p>
                </a>
                <p v-if="lgAndAbove" class="fr-header__service-tagline">
                  Comprendre le covoiturage
                </p>
              </div>
              <div class="fr-header__navbar">
                <button class="fr-btn--menu fr-btn" title="Menu" @click="openSidebar">
                  Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import Breakpoints from '@/components/mixins/breakpoints'
export default {
  name: "Header",
  mixins:[Breakpoints]
};
</script>
<style lang="scss" scoped>
  .fr-header {
    z-index: 1;
  }
  .obs_logo{
    display: flex;
    align-items: stretch;
  }
</style>