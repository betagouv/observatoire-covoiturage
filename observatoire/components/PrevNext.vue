<template>
  <nav role="navigation" class="fr-pagination" aria-label="Pagination">
    <ul class="fr-pagination__list pagination-center">
      <li v-if="prev">
        <NuxtLink :to="`${path}/${prev.slug}`" class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label">
          {{ shortString(prev.title) }}
        </NuxtLink>
      </li>
      <li v-if="next">
        <NuxtLink :to="`${path}/${next.slug}`" class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label">
          {{ shortString(next.title) }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class PrevNext extends Vue{
  $route:any
  @Prop({default:null}) prev!: object
  @Prop({default:null}) next!: object

  get path(){
    return this.$route.path.substring(0, this.$route.path.lastIndexOf('/'))
  }

  public shortString(string:string){
    return (string.length > 50) ? `${string.slice(0,50)}...` : string
  }
}
</script>