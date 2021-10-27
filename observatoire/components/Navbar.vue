<template>
  <!-- Navigation principale -->
  <div class="fr-header__menu fr-modal" id="modal_menu" aria-labelledby="button_menu">
    <div class="fr-container">
      <button class="fr-link--close fr-link" aria-controls="modal_menu">Fermer</button>
      <div class="fr-header__menu-links"></div>
      <nav class="fr-nav" id="navigation" role="navigation" aria-label="Menu principal">
        <ul class="fr-nav__list">
          <li class="fr-nav__item">
            <NuxtLink to="/" class="fr-nav__link" target="_self">
              Accueil
            </NuxtLink>
          </li>
          <li class="fr-nav__item">
            <NuxtLink to="/pages/qui-sommes-nous" class="fr-nav__link" target="_self">
              Qui sommes-nous ?
            </NuxtLink>
          </li>
          <li class="fr-nav__item">
            <NuxtLink to="/actualites" class="fr-nav__link" target="_self">
              Actualités
            </NuxtLink>
          </li>
          <li class="fr-nav__item">
            <NuxtLink to="/ressources" class="fr-nav__link" target="_self">
              Ressources
            </NuxtLink>
          </li>
          <li class="fr-nav__item">
            <NuxtLink to="/cartes" class="fr-nav__link" target="_self">
              Cartes interactives
            </NuxtLink>
          </li>
          <li class="fr-nav__item">
            <NuxtLink to="/dashboard" class="fr-nav__link" target="_self">
              Tableau de bord
            </NuxtLink>
          </li>
          <li class="fr-nav__item">
            <NuxtLink to="/pages/glossaire" class="fr-nav__link" target="_self">
              Glossaire
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>