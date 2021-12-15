<template>
  <footer class="fr-footer" role="contentinfo" id="footer">
    <div class="fr-container">
      <div class="fr-footer__body">
        <div class="fr-footer__brand fr-enlarge-link">
          <p class="fr-logo" title="république française">
            république
            <br />française
          </p>
          <a class="fr-footer__brand-link" href="/" title="Retour à l’accueil">
          </a>
        </div>
        <div class="fr-footer__content">
          <div class="fr-footer__social">
            <h6>Restons connectés</h6>
            <ul class="fr-footer__social-list">
              <li v-if="social.twitter" class="fr-footer__social-item twitter">
                <a :href="social.twitter" target="_blank" class="no-icon">
                  <img src="/images/social/twitter.svg" alt="Twitter" />
                </a>
              </li>
              <li v-if="social.youtube" class="fr-footer__social-item youtube">
                <a :href="social.youtube" target="_blank" class="no-icon">
                  <img src="/images/social/youtube.svg" alt="Youtube" />
                </a>
              </li>
              <li v-if="social.linkedin" class="fr-footer__social-item linkedin">
                <a :href="social.linkedin" target="_blank" class="no-icon">
                  <img src="/images/social/linkedin.svg" alt="Linkedin" />
                </a>
              </li>
              <li v-if="social.github" class="fr-footer__social-item github">
                <a :href="social.github" target="_blank" class="no-icon">
                  <img src="/images/social/github.svg" alt="Github" />
                </a>
              </li>
              <li v-if="social.rss" class="fr-footer__social-item rss">
                <a :href="social.rss" target="_blank" class="no-icon">
                  <img src="/images/social/rss.svg" alt="RSS" />
                </a>
              </li>
            </ul>
          </div>
          <div v-if="$config.newsletter"  class="fr-footer__newsletter">
            <h6>Recevoir les actualités</h6>
            <p><a href="https://covoiturage.beta.gouv.fr/abonnez-vous" class="fr-link fr-btn">Abonnez-vous</a></p>
          </div>
        </div>
        <div class="fr-footer__bottom">
          <ul class="fr-footer__bottom-list">
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" href="https://covoiturage.beta.gouv.fr/nous-contacter" target="_blank">Nous contacter</a>
            </li>
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" :href="services.legal" target="_blank">Mentions légales</a>
            </li>
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" :href="services.doc" target="_blank">Documentation</a>
            </li>
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" :href="services.tech" target="_blank">Doc technique</a>
            </li>
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" :href="services.ministry" target="_blank"
                >Ministère de la transition écologique</a
              >
            </li>
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" :href="services.betagouv" target="_blank">beta.gouv.fr</a>
            </li>
            <li class="fr-footer__bottom-item">
              <a class="fr-footer__bottom-link" href="https://design.numerique.gouv.fr/accessibilite-numerique/cadre-legal/"
                >Accessibilité: non conforme</a
              >
            </li>
          </ul>
          <div class="fr-footer__bottom-copy">
            <p>
              Sauf mention contraire, tous les textes de ce site sont sous
              <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank">licence etalab-2.0</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component,Vue } from 'nuxt-property-decorator'


@Component
export default class Footer extends Vue{
  social = {
    twitter:'https://twitter.com/Covoitbetagouv',
    youtube:'https://www.youtube.com/channel/UC-Dge-XxJCIRG22jcGM-VtA',
    linkedin:'https://www.linkedin.com/company/registre-de-preuve-de-covoiturage',
    github:'https://github.com/betagouv/observatoire-covoiturage',
    rss:''
  }
  services = {
    legal: 'https://doc.covoiturage.beta.gouv.fr/ressources/mentions-legales',
    doc: 'https://doc.covoiturage.beta.gouv.fr',
    tech: 'https://tech.covoiturage.beta.gouv.fr',
    ministry: 'https://ecologie.gouv.fr',
    betagouv: 'https://beta.gouv.fr'
  }
}
</script>

<style lang="scss">
  @import "~/assets/scss/_variables.scss";
  .fr-footer__logo {
    max-width: 80px;
  }

  .fr-footer__body {
    align-items: flex-start;
  }

  .fr-footer__content {
    display: flex;
    flex-direction: row;
    @media screen and (max-width: $bp-md) {
      flex-direction: column;
    }
    & > div {
      flex-basis: 50%;
    }
  }

  .fr-footer__social {
    .fr-footer__social-list {
      list-style: none;
      margin: 0;
      .fr-footer__social-item {
        display: inline-block;
        width: 30px;
        margin: 0;
        margin-right: 5px;
        a {
          display: block;
          max-width: 30px;
          padding: 2px;
          border-radius: 0;
          transition: border-radius 0.1s linear;
          &:hover {
            padding: 0;
            border-radius: 16px;
          }
          img {
            display: block;
            max-width: 100%;
          }
        }
        &.twitter a {
          background: #55acee;
        }
        &.youtube a {
          background: #d42428;
        }
        &.linkedin a {
          background: #007ab9;
        }
        &.github a {
          background: #455a64;
        }
        &.rss a {
          background: #f4b459;
        }
      }
    }
  }

  .fr-footer__newsletter {
    .fr-search-bar {
      .fr-btn {
        &::before {
          content: "";
        }
      }
    }
    .fr-footer__newsletter-desc {
      margin-top: 1em;
      padding: 0.2em 0.6em 1em;
      font-size: 80%;
      line-height: 1.4;
    }
  }

  .fr-footer__newsletter-success,
  .fr-footer__newsletter-error {
    overflow: hidden;
    max-height: 100px;
    transition: max-height 0.5s ease;
    &.hidden {
      max-height: 0;
    }
    div {
      margin: 0.5em 0.2em 1em;
      padding: 0.3em 0.4em;
      font-size: 90%;
      border: 2px solid currentColor;
      color: var(--success);
      border-radius: 4px;
      background: transparent;
    }
  }

  .fr-footer__newsletter-error {
    color: var(--error);
  }
</style>

