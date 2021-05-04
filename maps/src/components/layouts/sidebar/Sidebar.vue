<template>
  <nav class="fr-sidemenu--sticky-full-height" role="navigation" aria-label="Menu latéral">
    <div class="fr-sidemenu__inner">
      <button class="fr-sidemenu__btn" aria-controls="fr-sidemenu-wrapper" aria-expanded="false">Configurer la carte</button>
      <div class="fr-collapse" id="fr-sidemenu-wrapper">
        <ul class="fr-sidemenu__list">
          <li class="fr-sidemenu__item">
            <button class="fr-sidemenu__btn" aria-expanded="false" aria-controls="fr-sidemenu-item-0">Niveau 1</button>
            <div class="fr-collapse" id="fr-sidemenu-item-0">
              <ul class="fr-sidemenu__list">
                <li class="fr-sidemenu__item">
                  <a class="fr-sidemenu__link" href="#" target="_self">Accès direct niveau 2</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <Slider :sliderOptions="{'min':1,'max':1000,'step':1}"/>
    </div>
  </nav>
</template>

<script>
import Slider from '@/components/layouts/sidebar/Slider'
export default {
  name: "Sidebar",
  components: {
    Slider
  },
};
</script>
