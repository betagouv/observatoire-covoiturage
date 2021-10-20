<template>
  <nav v-if="lastPage > 1" role="navigation" class="fr-pagination" aria-label="Pagination">
    <ul class="fr-pagination__list pagination-center">
      <li>
        <p  v-if="currentPage === 1" class="fr-pagination__link fr-pagination__link--first">
          Première page
        </p>
        <NuxtLink v-else class="fr-pagination__link fr-pagination__link--first" :to="`/${type}`">
          Première page
        </NuxtLink>
      </li>
      <li>
        <p v-if="currentPage === 1" class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label">
          Page précédente
        </p>
        <NuxtLink v-else class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label" :to="`/${type}/page/${currentPage-1}`">
          Page précédente
        </NuxtLink>
      </li>
      <li >
      <li v-for="index in lastPage" :key="index">
        <p v-if="index === currentPage" class="fr-pagination__link" aria-current="page" :title="`Page ${index}`">
          {{index}}
        </p>
        <NuxtLink v-else class="fr-pagination__link" :to="`/${type}/page/${index}`" :title="`Page ${index}`">
          {{index}}
        </NuxtLink>
      </li>
      <li>
        <p v-if="currentPage === lastPage" class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label">
          Page suivante
        </p>
        <NuxtLink v-else class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label" :to="`/${type}/page/${currentPage+1}`">
          Page suivante
        </NuxtLink>
      </li>
      <li>
        <p v-if="currentPage === lastPage" class="fr-pagination__link fr-pagination__link--last">
          Dernière page 
        </p>
        <NuxtLink v-else class="fr-pagination__link fr-pagination__link--last" :to="`/${type}/page/${lastPage}`">
          Dernière page 
        </NuxtLink>
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