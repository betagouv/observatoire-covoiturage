<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
           <Breadcrumb :current="category[0].name"/>
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-12">
              <h1 class="h-text-center">Catégorie : {{category[0].name}}</h1>
            </div>
            <div class="fr-col-md-4" v-for="actualite of actualites" :key="actualite.slug">
              <div class="fr-card fr-enlarge-link">
                <div class="fr-card__body">
                  <p class="fr-card__detail">Détail</p>
                  <h4 class="fr-card__title">
                    <NuxtLink :to="`${actualite.categories[0]}/${actualite.slug}`" class="fr-card__link">
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
export default class Category extends Vue{
    async asyncData({ $content, params }) {
      const category = await $content('categories')
      .only(['name', 'slug'])
      .where({ slug: { $eq: params.category } })
      .fetch()

      const actualites = await $content('actualites')
        .where({categories:{$contains: params.category}})
        .only(['title', 'description', 'img', 'slug','categories'])
        .sortBy('createdAt', 'asc')
        .fetch()

      return { category, actualites }
    }
  }
</script>
