import { Component, mixins } from 'nuxt-property-decorator'
import { ckmeans } from 'simple-statistics'
import maplibregl from 'maplibre-gl'
import { Deck } from '@deck.gl/core'
import BreakpointsMixin from './breakpoints'
import { MapOptionsInterface, MapAnalyseInterface } from '../interfaces/maps'

@Component
export default class MapMixin extends mixins(BreakpointsMixin) {
  
  defaultOptions:MapOptionsInterface = {
    center: [2.087, 46],
    style: process.env.NUXT_ENV_MAPLIBRE_STYLE || '',
    zoom: 5,
    zoomMobile: 4,
    controls: false,
    attribution: true
  }

  isHovering = false

  async createMap(container:string, options?:MapOptionsInterface) {
    options = { ...this.defaultOptions, ...options }
    if (!maplibregl.supported() && process.client) {
      alert('Your browser does not support Maplibre GL')
    } else {
      this.$data[container] = new maplibregl.Map({
      container: container,
        style: options.style,
        center: options.center,
        zoom: this.zoomMobile(options),
        attributionControl: options.attribution
      })
      if(options.controls){
        this.$data[container].addControl(new maplibregl.NavigationControl(), 'top-left')
      }
    }      
  }

  async createDeck(container:string, options:MapOptionsInterface, layer:any, tooltip:any) {
      // empêche le menu contextuel de s'ouvrir sur le clic droit
      document.getElementById(container)!
      .addEventListener("contextmenu", e => e.preventDefault())
      
      this.$data[container] = new Deck({
        canvas: container,
        width: '100%',
        height: '100%',
        initialViewState: {
          latitude: options.center[1],
          longitude:options.center[0],
          zoom: this.zoomMobile(options),
          bearing: 0,
          pitch: 0
        },
        controller: true,
        onViewStateChange: ({viewState}) => {
          this.$data[container].jumpTo({
            center: [viewState.longitude, viewState.latitude],
            zoom: viewState.zoom,
            bearing: viewState.bearing,
            pitch: viewState.pitch
          })
        },
        onHover: ({object}) => (this.isHovering = Boolean(object)),
        getCursor: ({isDragging}) => (isDragging ? 'grabbing' : (this.isHovering ? 'pointer' : 'grab')),
        layers:[layer],
        getTooltip:tooltip
      })
  }

  hexToRgb(hex:string):[number, number, number] {
    const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)
    if(m) {
    const rgb:[number, number, number] = [parseInt(m[1], 16),parseInt(m[2], 16),parseInt(m[3], 16)]
    return rgb
    } else {
      return [0,0,0]
    }
  }

  jenks(data:Array<Object>,field:string,colors:Array<string>,width:Array<number>){
    const vals:Array<number> = data.map(d => d[field])
    const breaks = ckmeans(vals, colors.length - 1)
    let analysis:{
      val: number;
      color: [number, number, number];
      width: number;
  }[] = breaks.map((b,i) => {
      return {val:b[0],color:this.hexToRgb(colors[i]),width:width[i]} 
    })
    return analysis
  }

  classColor(val:number, datas:Array<MapAnalyseInterface>) {
    const analysisClass = datas.map(d => d.val)
    const classe = analysisClass.reduce((prev, curr) => {
      return Math.abs(curr - val) > Math.abs(prev - val) ? prev : curr
    })
    return datas.find(d => d.val === classe)?.color || [0,0,0]
  }

  public classWidth(val:number, datas:Array<MapAnalyseInterface>) {
    const analysisClass = datas.map(d => d.val)
    const classe = analysisClass.reduce((prev, curr) => {
      return Math.abs(curr - val) > Math.abs(prev - val) ? prev : curr
    })
    return datas.find(d => d.val === classe)?.width
  }

  zoomMobile(options:MapOptionsInterface){
    if(!this.lgAndAbove && options.zoomMobile){
      return options.zoomMobile
    } else {
      return options.zoom
    }
  }
}
