<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
           <Breadcrumb :current="category[0].name"/>
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList :title="`Actualités dans la catégorie : ${category[0].name}`" :contents="actualites" :taxonomies="taxonomies"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class ActualitesCategory extends Vue{
    async asyncData({ $content, params, error }) {
      const category = await $content('categories')
      .only(['name', 'slug'])
      .where({ slug: { $eq: params.category } })
      .fetch()

      const actualites = await $content('actualites')
        .where({categories:{$contains: params.category}})
        .only(['title', 'description', 'img', 'slug','categories','themes','dir','createdAt'])
        .sortBy('createdAt', 'asc')
        .fetch()

      if (!actualites.length) {
        return error({ statusCode: 404, message: "La catégorie que vous recherchez est vide ou n'existe pas." });
      }

      const categories = await $content('categories')
      .only(['name', 'slug'])
      .fetch()

      const themes = await $content('themes')
      .only(['name', 'slug'])
      .fetch()

      const taxonomies = {'categories':categories,'themes':themes}

      return { category, actualites, taxonomies }
    }
  }
</script>
