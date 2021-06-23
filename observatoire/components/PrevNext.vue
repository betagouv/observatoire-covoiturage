<template>
  <nav role="navigation" class="fr-pagination" aria-label="Pagination">
    <ul class="fr-pagination__list pagination-center">
      <li v-if="prev">
        <a :href="prev.slug" class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label">
          {{ prev.title }}
        </a>
      </li>
      <li v-if="next">
        <a :href="next.slug" class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label">
          {{ next.title }}
        </a>
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