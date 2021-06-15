<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <Breadcrumb />
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-12">
              <h1 class="h-text-center">Actualités</h1>
            </div>
            <div class="fr-col-md-4" v-for="actualite of actualites" :key="actualite.slug">
              <div class="fr-card fr-enlarge-link">
                <div class="fr-card__body">
                  <p class="fr-card__detail">
                    <ul class="fr-tags-group">
                      <li v-for="category of actualite.categories" :key="category">
                        <NuxtLink :to="`actualites/${category}`" class="fr-tag" target="_self">
                          {{categories.find(c => c.slug === category).name}}
                        </NuxtLink>
                      </li>
                    </ul>  
                  </p>
                  <h4 class="fr-card__title">
                    <NuxtLink :to="`actualites/${actualite.categories[0]}/${actualite.slug}`" class="fr-card__link">
                      {{ actualite.title }}
                    </NuxtLink>
                  </h4>
                  <p class="fr-card__desc">
                    {{ actualite.description }}
                  </p>
                </div>
                <div class="fr-card__img">
                  <img :src="actualite.img" class="fr-responsive-img" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Actualites extends Vue{
    async asyncData({ $content, params }) {
      const actualites = await $content('actualites')
      .only(['title', 'description', 'img', 'slug','categories'])
      .sortBy('createdAt', 'asc')
      .fetch()

      const categories = await $content('categories')
      .only(['name', 'slug'])
      .fetch()

      return { actualites, categories }
    }
  }
</script>
