<template>
  <div class="fr-section">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
           <Breadcrumb :type="type" :current="theme[0].name"/>
        </div>
        <div class="fr-col-lg-10 fr-col-offset-lg-1">
          <ContentList :title="`S'informer sur le thème : ${theme[0].name}`" :contents="ressources" :taxonomies="taxonomies" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class RessourcesCategory extends Vue{
  type = {name:'S\'informer',slug:'ressources'}
  
  async asyncData({ $content, params, error }) {
    const theme = await $content('themes')
    .only(['name', 'slug'])
    .where({ slug: { $eq: params.theme } })
    .fetch()

    const ressources = await $content('ressources')
      .where({themes:{$contains: params.theme}})
      .only(['title', 'description', 'img', 'slug','categories', 'themes','dir','createdAt'])
      .sortBy('createdAt', 'asc')
      .fetch()

    if (!ressources.length) {
      return error({ statusCode: 404, message: "Le thème que vous recherchez est vide ou n'existe pas." });
    }

    const categories = await $content('categories')
    .only(['name', 'slug'])
    .fetch()

    const themes = await $content('themes')
    .only(['name', 'slug'])
    .fetch()

    const taxonomies = {'categories':categories,'themes':themes}

    return { theme, ressources, taxonomies }
  }
}
</script>
