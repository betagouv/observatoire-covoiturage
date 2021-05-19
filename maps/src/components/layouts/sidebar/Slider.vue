<template>
  <div class="slider">
    <b-slider  
      v-model="computedValue" 
      :min="sliderOptions.min" 
      :max="sliderOptions.max" 
      :step="sliderOptions.step" 
      :tooltip="false" 
    >
    </b-slider>
    <b-field>
      <b-numberinput v-model="computedValue[0]" size="is-small" :controls="false"/>
      <span class="separator"> et </span>
      <b-numberinput v-model="computedValue[1]" size="is-small" :controls="false"/>
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
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.separator{
  padding: 0 10px;
}
</style>

