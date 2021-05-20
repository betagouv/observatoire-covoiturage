<template>
  <div class="slider">
    <b-slider  
      v-model="selectedValue" 
      :min="sliderOptions.min" 
      :max="sliderOptions.max" 
      :step="sliderOptions.step" 
      :tooltip="false" 
    >
    </b-slider>
    <b-field>
      <b-numberinput v-model="selectedValue[0]" size="is-small" :controls="false"/>
      <span class="separator"> et </span>
      <b-numberinput v-model="selectedValue[1]" size="is-small" :controls="false"/>
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
    selectedValue: {
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

