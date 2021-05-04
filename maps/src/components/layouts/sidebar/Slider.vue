<template>
  <b-field class="slider">
    <b-slider  
      v-model="computedValue" 
      :min="sliderOptions.min" 
      :max="sliderOptions.max" 
      :step="sliderOptions.step" 
      expanded 
      :tooltip="false" 
      indicator
    >
    </b-slider>
  </b-field>
</template>
<script>
export default {
  name: "Slider",
  props:{
    sliderOptions:{
      type:Object,
      default: () => {
        return { 
          min: Number,
          max: Number,
          step: Number,
          format: String
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .slider{
    padding: 0 1em;
    // Set your colors
    $primary: #000091;
    @import "~bulma";
    @import "~buefy/src/scss/buefy";
  }
</style>