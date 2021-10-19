<template>
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
            <a href="/cartes" class="fr-nav__link" target="_self">
              Cartes interactives
            </a>
          </li>
          <li class="fr-nav__item">
            <a href="/dashboard" class="fr-nav__link" target="_self">
              Tableau de bord
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>