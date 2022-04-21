<template>
  <div class="slider">
    <o-slider  
      v-model="selectedValue" 
      :min="sliderOptions.min" 
      :max="sliderOptions.max" 
      :step="sliderOptions.step"
      lazy
      rounded
    >
    </o-slider>
    <o-field>
      <span class="separator"> de </span>
      <o-input type="number" class="fr-input" v-model="selectedValue[0]" size="is-small"/>
      <span class="separator"> à </span>
      <o-input class="fr-input" v-model="selectedValue[1]" type="number" size="is-small"/>
    </o-field>
  </div>
</template>

<script lang="ts">
import { Component,Vue,PropSync,Prop } from 'nuxt-property-decorator'

@Component
export default class Slider extends Vue{
  @PropSync('value', { required: true, type: Array }) selectedValue!: [number,number]
  @Prop() sliderOptions!: { min: number, max: number, step: number }
}
</script>
<style lang="scss" scoped>
.separator{
  padding: 0 10px;
}
</style>