<template>
<div class="fr-section">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-lg-8 fr-col-offset-lg-2">
        <div class="fr-grid-row fr-grid-row--gutters">
          <article class="fr-col-12">
            <figure class="fr-content-media fr-content-media--sm">
              <div class="fr-content-media__img">
                <img class="fr-responsive-img fr-responsive-img--1x1" src="/images/tools.svg">
              </div>
            </figure>
            <h1 v-if="error.statusCode">Erreur {{error.statusCode}}</h1>
            <h1 v-else>Une erreur est apparue</h1>
            <h2 v-if="error.message">{{error.message}}</h2>
          </article>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'error' // you can set a custom layout for the error page
}
</script>
<style lang="scss" scoped>
.fr-content-media__img img{
  object-fit: contain;
}
</style>
