<template>
  <nav class="fr-sidemenu--full-border" :class="{'fr-p-1w': !lgAndAbove}" role="navigation" aria-label="Menu latéral">
    <div class="fr-sidemenu__inner">
      <ul class="fr-sidemenu__list">
        <div class="fr-sidemenu__title">Mois sélectionné :</div>
        <li class="fr-sidemenu__item">
          <b-field grouped>
            <b-field>
              <select v-model="selectedTime.month" class="fr-select" id="select-month" name="select-month">
                <option v-for="option in monthList" :value="option.id" :key="option.id">{{option.name}}</option>
              </select>
            </b-field>
            <b-field>
              <select v-model="selectedTime.year" class="fr-select" id="select-year" name="select-year">
                <option v-for="option in yearList" :value="option" :key="option">{{option}}</option>
              </select>
            </b-field>
          </b-field>
        </li>
      </ul>
      <ul class="fr-sidemenu__list">
        <div class="fr-sidemenu__title">Nombre de trajets entre :</div>
        <Slider v-model="selectedValue" :sliderOptions="{'min':sliderOptions.min,'max':sliderOptions.max,'step':sliderOptions.step}"/>
      </ul>
    </div>
  </nav>
</template>

<script>
import Slider from '@/components/layouts/sidebar/Slider'
import Time from '@/components/mixins/time'
import Breakpoints from '@/components/mixins/breakpoints'

export default {
  name: "Sidebar",
  components: {
    Slider
  },
  mixins:[Time,Breakpoints],
  props:{
    value: {
      type: Array,
      required: true
    },
    time:{
      type: Object,
      default: () => {
        return { 
          year: String,
          month: String
        }
      },
      required:true
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
    },
    journeys: {
      type: String,
      required: true
    }
  },
  computed:{
    selectedValue: {
      get() { return this.value },
      set(value) {this.$emit('input', value)}
    },
    selectedTime:{
      get() { return this.time },
      set(time) {this.$emit('input', time)}
    },
  }
}
</script>
<style lang="scss" scoped>
  .slider{
    padding: 0 1em;
  }
  .fr-sidemenu__title{
    font-size: 1rem !important;
  }
</style>
