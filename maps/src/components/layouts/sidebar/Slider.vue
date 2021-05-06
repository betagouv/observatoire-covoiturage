<template>
  <div class="slider">
    <b-slider  
      v-model="computedValue" 
      :min="sliderOptions.min" 
      :max="sliderOptions.max" 
      :step="sliderOptions.step" 
      expanded 
      lazy
      :tooltip="false" 
      indicator
    >
    </b-slider>
    <b-field>
      <b-input v-model="computedValue[0]"></b-input>
      <b-input v-model="computedValue[1]"></b-input>
    </b-field>
  </div>
</template>
<script>
export default {
  name: "Slider",
  props:{
    value: {
      type: Array,
      required: true
    },
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
  },
  computed:{
    computedValue: {
      get() { return this.value },
      set(value) {this.$emit('input', value)}
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