<template>
  <div class="slider">
    <b-slider  
      v-model="selectedValue" 
      :min="sliderOptions.min" 
      :max="sliderOptions.max" 
      :step="sliderOptions.step"
      lazy
    >
    </b-slider>
    <b-field>
      <span class="separator"> de </span>
      <b-numberinput v-model="selectedValue[0]" size="is-small" :controls="false"/>
      <span class="separator"> à </span>
      <b-numberinput v-model="selectedValue[1]" size="is-small" :controls="false"/>
    </b-field>
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