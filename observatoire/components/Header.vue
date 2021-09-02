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
    <Navbar />
  </header>
</template>

