<template>
  <nav role="navigation" class="fr-pagination" aria-label="Pagination">
    <ul class="fr-pagination__list">
      <li v-if="prev">
        <NuxtLink :to="prev.slug" class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label">
          {{ prev.title }}
        </NuxtLink>
      </li>
      <li v-if="next">
        <NuxtLink :to="next.slug" class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label">
          {{ next.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class PrevNext extends Vue{
  @Prop({default:null}) prev!: object
  @Prop({default:null}) next!: object
}
</script>