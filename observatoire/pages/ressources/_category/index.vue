<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
           <Breadcrumb :type="type" :current="category[0].name"/>
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList :title="`Ressource dans la catégorie : ${category[0].name}`" :contents="ressources" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class RessourcesCategory extends Vue{
  type = {name:'Ressources',slug:'ressources'}
  
  async asyncData({ $content, params, error }) {
    const category = await $content('categories')
    .only(['name', 'slug'])
    .where({ slug: { $eq: params.category } })
    .fetch()

    const ressources = await $content('ressources')
      .where({categories:{$contains: params.category}})
      .only(['title', 'description', 'img', 'slug','categories','dir','createdAt'])
      .sortBy('createdAt', 'asc')
      .fetch()

    if (!ressources.length) {
      return error({ statusCode: 404, message: "La catégorie que vous recherchez est vide ou n'existe pas." });
    }
    return { category, ressources }
  }
}
</script>
