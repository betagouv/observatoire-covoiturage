<template>
  <header role="banner" class="fr-header">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo">
                  Ministère<br />
                  de la transition<br />
                  écologique
                </p>
              </div>
              <div class="fr-header__navbar">
                <button
                  class="fr-btn--menu fr-btn"
                  data-fr-opened="false"
                  aria-controls="modal-833"
                  aria-haspopup="menu"
                  title="Menu"
                >
                  Menu
                </button>
              </div>
            </div>
            <div class="fr-header__service">
              <a
                href="/"
                title="Accueil - [À MODIFIER | Nom du site / service] - [À MODIFIER | nom de l’entité (ministère , secrétariat d‘état, gouvernement)]"
              >
                <p class="fr-header__service-title">Observatoire du covoiturage au quotidien</p>
              </a>
              <p class="fr-header__service-tagline">
                Comprendre le covoiturage
              </p>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-links-group">
                <li>
                  <a class="fr-link fr-fi-add-circle-line" href="#">Créer un espace</a>
                </li>
                <li>
                  <a class="fr-link fr-fi-lock-line" href="#">Se connecter</a>
                </li>
                <li>
                  <a class="fr-link fr-fi-account-line" href="#">S’enregistrer</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>
<style lang="scss">
  .fr-header {
    z-index: 1;
  }
</style>