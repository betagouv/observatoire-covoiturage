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
                <button class="fr-btn--search fr-btn" data-fr-opened="false" aria-controls="modal_search" title="Rechercher">
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
            <SearchInput/>
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
                  <a href="/" class="fr-nav__link" target="_self">
                    Accueil
                  </a>
                </li>
                <li class="fr-nav__item">
                  <a href="/actualites" class="fr-nav__link" target="_self">
                    Actualités
                  </a>
                </li>
                <li class="fr-nav__item">
                  <a href="/ressources" class="fr-nav__link" target="_self">
                    S'informer
                  </a>
                </li>
                <li class="fr-nav__item">
                  <button class="fr-nav__btn" aria-expanded="false" aria-controls="menu-cartes" aria-current="true">Cartes</button>
                  <div class="fr-collapse fr-menu" id="menu-cartes">
                    <ul class="fr-menu__list">
                      <li>
                        <a href="/cartes/flux" class="fr-nav__link" target="_self">
                          Flux de trajets
                        </a>
                      </li>
                      <li>
                        <a href="/cartes/occupation-vehicules" class="fr-nav__link" target="_self">
                          Occupation des véhicules
                        </a>
                      </li>
                      <li>
                        <a href="/cartes/aires-covoiturage" class="fr-nav__link" target="_self">
                          Aires de covoiturage
                        </a>
                      </li>
                      
                    </ul>
                  </div>
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
