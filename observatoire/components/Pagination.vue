<template>
  <nav v-if="lastPage > 1" role="navigation" class="fr-pagination" aria-label="Pagination">
    <ul class="fr-pagination__list pagination-center">
      <li>
        <a  v-if="currentPage === 1" class="fr-pagination__link fr-pagination__link--first">
          Première page
        </a>
        <a v-else class="fr-pagination__link fr-pagination__link--first" :href="`/${type}`">
          Première page
        </a>
      </li>
      <li>
        <a v-if="currentPage === 1" class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label">
          Page précédente
        </a>
        <a v-else class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label" :href="`/${type}/page/${currentPage-1}`">
          Page précédente
        </a>
      </li>
      <li >
      <li v-for="index in lastPage" :key="index">
        <a v-if="index === currentPage" class="fr-pagination__link" aria-current="page" :title="`Page ${index}`">
          {{index}}
        </a>
        <a v-else class="fr-pagination__link" :href="`/${type}/page/${index}`" :title="`Page ${index}`">
          {{index}}
        </a>
      </li>
      <li>
        <a v-if="currentPage === lastPage" class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label">
          Page suivante
        </a>
        <a v-else class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label" :href="`/${type}/page/${currentPage+1}`">
          Page suivante
        </a>
      </li>
      <li>
        <a v-if="currentPage === lastPage" class="fr-pagination__link fr-pagination__link--last">
          Dernière page 
        </a>
        <a v-else class="fr-pagination__link fr-pagination__link--last" :href="`/${type}/page/${lastPage}`">
          Dernière page 
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class Pagination extends Vue{
  @Prop({default:'ressources'}) type!: string
  @Prop({default:1}) currentPage!: number
  @Prop({default:1}) lastPage!: number
}
</script>