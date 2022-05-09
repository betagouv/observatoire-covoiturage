<template>
  <div v-if="lgAndAbove || screen.isLegendOpen" class='legend'>
    <div class='legend-title'>{{title}}</div>
    <div v-if="type !== 'proportional_circles'">
      <div class="item" v-for="classe in legend" :key="classe.name">
        <span class="legend-class" :style="'height:'+classe.width+'px;background-color:rgb('+classe.color[0]+','+classe.color[1]+','+classe.color[2]+')'"></span>
        <span class="legend-class-name">{{classe.name}}</span>
      </div>
    </div>
    <div class="proportional_circles" v-else :style="'min-height:'+legend[0].width*2+'px;'">
      <div v-for="(classe, index) in legend" :key="index" class="item">
        <div class="circle-class" :style="'height:'+classe.width*2+'px; width:'+classe.width*2+'px; bottom:0px; left:'+(legend[0].width-classe.width)+'px;background-color:rgb('+classe.color[0]+','+classe.color[1]+','+classe.color[2]+')'"></div>
        <hr :style="'width:'+legend[0].width+'px; bottom:'+(classe.width*2-1)+'px; left:'+(legend[0].width)+'px;'"/>
        <div class="circle-label" :style="'bottom:'+(classe.width*2-10)+'px; left:'+(legend[0].width*2+10)+'px;'">
          {{classe.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component,mixins,Prop } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'

@Component
export default class Legend extends mixins(BreakpointsMixin){
  @Prop({ required: true }) title!: string
  @Prop({ required: true }) analyzes!: Array<{color:Array<number>,val:number,width:number}>
  @Prop({ required: true }) type!: string

  get legend(){
    let legend:Array<{color:Array<number>,name:string | number,width:number}> =  []
    if (this.analyzes.length > 1){
      if(this.type === 'interval'){
        for(let key in this.analyzes){
          let classe = {
            color:[255,255,255],
            name:'',
            width:0
          }
          if(Number(key) === this.analyzes.length-1){
            classe = {
              color: this.analyzes[key].color,
              name : ">= " +this.analyzes[key].val,
              width :  this.analyzes[key].width
            }
          } else {
            classe = {
              color: this.analyzes[key].color,
              name : this.analyzes[key].val + " à " + (this.analyzes[Number(key)+1].val),
              width :  this.analyzes[key].width
            }
          }
          legend.push(classe)
        }
      } else if(['category','proportional_circles'].includes(this.type)){
        for(let key in this.analyzes){
          const classe = {
            color: this.analyzes[key].color,
            name : this.analyzes[key].val,
            width :  this.analyzes[key].width
          }
          legend.push(classe)
        }
      }
    }
    return legend
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
    width: 200px;
      @media screen and (min-width: 992px) {
        font-size: 1em;
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
    .proportional_circles{
      position: relative;
      margin-top: 10px;
      hr {
        position: absolute;
        height: 1px; 
        background-color: black;
        background-image: none;
        padding: 0;
        margin:0;
      }
      .circle-class{
        border: 1px solid black;
        border-radius: 50%;
        background: whitesmoke;
        position: absolute;
      }
      .circle-label{
        position: absolute;
        font-size: 0.8em;
      }
    }
  }
  .upper_legend{
    bottom: 250px;
  }
</style>