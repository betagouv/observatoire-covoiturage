<template>
  <div class="fr-header__search fr-modal" id="modal_search">
    <div class="fr-container fr-container-lg--fluid">
      <button class="fr-link--close fr-link" aria-controls="modal_search">Fermer</button>
      <div class="fr-search-bar" id="search" role="search">
        <label class="fr-label" for="search-input">Recherche
        </label>
        <input v-model="searchstring" class="fr-input" placeholder="Rechercher" type="search" autocomplete="off" id="search-input" name="search-input">
        <div class="fr-btn" title="Rechercher">
          Rechercher
        </div>
      </div>
      <div class="results" v-if="searchstring !== ''">
        <p v-if="!results || results.length === 0">Pas de résultats pour cette recherche...</p>
        <ul  v-if="results">
          <li v-for="result of results" :key="result.slug">
            <a v-if="result.dir === '/actualites'" :href="`${result.dir}/${result.categories[0]}/${result.slug}`">Actualites > {{ result.title }}</a>
            <a v-else-if="result.dir === '/ressources'" :href="`${result.dir}/${result.themes[0]}/${result.slug}`">S'informer > {{ result.title }}</a>
            <a v-else :href="`/${result.slug}`">{{ result.title }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'

@Component
export default class SearchInput extends Vue{
  searchstring = ''
  results = null
  $content:any

  @Watch('searchstring')
  async onSearchstringChanged() {
    if (!this.searchstring) {
      this.results = null
      return
    }
    this.results = await this.$content('/',{deep:true})
    .only(['dir','categories','themes','title', 'slug'])
    .sortBy('createdAt', 'asc')
    .search(this.searchstring)
    .fetch()
  }
}
</script>
<style lang="scss" scoped>
  .results{
    position:absolute;
    text-align: left;
    max-width: 400px;
    background-color: #ffffff;
    border: solid 1px #E7E7E7;
    p{
      padding: 0.2rem 0.5rem;
    }
    ul{
      padding: 0;
      li{
      padding: 0.2rem 0.5rem;
      }
      li:hover{
        background-color: #E7E7E7;
      }
    }
  }
</style>