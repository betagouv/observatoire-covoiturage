<template>
  <div v-if="screen.isLegendOpen" class='legend'>
    <div class='legend-title'>{{title}}</div>
    <div class="item" v-for="classe in legend" :key="classe.name">
      <span class="legend-class" :style="'height:'+classe.width+'px;background-color:rgb('+classe.color[0]+','+classe.color[1]+','+classe.color[2]+')'"></span>
      <span class="legend-class-name">{{classe.name}}</span>
    </div>
  </div>
</template>

<script>
import Breakpoints from '@/components/mixins/breakpoints'
export default {
  name: 'Legend',
  mixins:[Breakpoints],
  props:{
    title:{
      type: String,
      required: true
    },
    analysis: {
      type: Array,
      required: true
    },
  },
  computed:{
    legend(){
      let legend =  []
      if (this.analysis.length > 1){
        for(let key in this.analysis){
          let classe = null
          if(Number(key) === this.analysis.length-1){
            classe = {
              color: this.analysis[key].color,
              name : ">= " +this.analysis[key].val,
              width :  this.analysis[key].width
            }
          } else {
            classe = {
              color: this.analysis[key].color,
              name : this.analysis[key].val + " à " + (this.analysis[Number(key)+1].val -1),
              width :  this.analysis[key].width
            }
          }
          legend.push(classe)
        }
      }
      return legend
    }
  }
}
</script>

<style lang="scss" scoped>
  .legend {
    position: absolute;
    bottom: 25px;
    right: 0;
    overflow: auto;
    border-radius: 10%;
    padding: 10px;
    z-index: 1;
    background-color: #ffffff;
    font-size: 0.8em;
    width: 120px;
      @media screen and (min-width: 992px) {
        font-size: 1em;
        width: 250px;
      }
    .legend-class{
      display: inline-block;
      width: 30px;
      margin-right: 5px;
      background-color: #ccc;
    }
    .legend-title{
      font-weight: bold;
    }
  }
  

</style>