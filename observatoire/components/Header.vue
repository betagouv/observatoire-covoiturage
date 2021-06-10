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
              <div class="fr-header__navbar">
                <button class="fr-btn--search fr-btn" data-fr-opened="false" aria-controls="modal_menu" title="Rechercher">
                  Rechercher
                </button>
                <button class="fr-btn--menu fr-btn" data-fr-opened="false" aria-controls="modal_menu" aria-haspopup="menu" title="Menu">
                  Menu
                </button>
              </div>
              <div class="fr-header__operator">
                <a href="/" title="Observatoire du covoiturage au quotidien - Ministère de la transition écologique">
                  <p class="fr-header__service-title">Observatoire national du covoiturage au quotidien</p>
                </a>
                <p v-if="lgAndAbove" class="fr-header__service-tagline">
                  Comprendre le covoiturage
                </p>
              </div>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__search fr-modal" id="modal_search">
              <div class="fr-container fr-container-lg--fluid">
                <button class="fr-link--close fr-link" aria-controls="modal_search">Fermer</button>
                <div class="fr-search-bar" id="search" role="search">
                  <label class="fr-label" for="search-input">Recherche
                  </label>
                  <input class="fr-input" placeholder="Rechercher" type="search" id="search-input" name="search-input">
                  <button class="fr-btn" title="Rechercher">
                    Rechercher
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Navigation principale -->
    <div class="fr-header__menu fr-modal" id="modal_menu" aria-labelledby="button_menu">
        <div class="fr-container">
            <button class="fr-link--close fr-link" aria-controls="modal_menu">Fermer</button>
            <div class="fr-header__menu-links"></div>
            <nav class="fr-nav" id="navigation" role="navigation" aria-label="Menu principal">
                <ul class="fr-nav__list">
                    <li class="fr-nav__item">
                        <a class="fr-nav__link" href="#" target="_self">accès direct</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component,mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../components/mixins/breakpoints'


@Component
export default class Header extends mixins(BreakpointsMixin){
}
</script>
