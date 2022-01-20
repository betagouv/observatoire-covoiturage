import { Component, mixins } from 'nuxt-property-decorator'
import { ckmeans } from 'simple-statistics'
import maplibregl from 'maplibre-gl'
import { Deck } from '@deck.gl/core'
import BreakpointsMixin from './breakpoints'




interface Territory {
  name:string,
  center:[number, number],
  zoom:number,
  zoomMobile?:number,
  controls?:boolean,
  attribution:boolean
}

interface Analyse {
  val:number,
  color:[number,number,number],
  width:number
}

@Component
export default class MapsMixin extends mixins(BreakpointsMixin) {
  territories:Array<Territory>=[
    {
      name: 'metropole',
      center: [2.087, 46],
      zoom: 5,
      zoomMobile: 4,
      controls: false,
      attribution: true
    },
    {
      name: 'antilles',
      center: [-61.3367, 15.372],
      zoom: 6,
      attribution: false
    },
    {
      name: 'guyane',
      center: [-53.097, 3.83],
      zoom: 5,
      attribution: false
    },
    {
      name: 'mayotte',
      center: [45.167, -12.8503],
      zoom: 9,
      attribution: false
    },
    {
      name: 'reunion',
      center: [55.5155, -21.0883],
      zoom: 7,
      attribution: false
    }
  ]

  isHovering = false

  createMap(container:string,options:Territory) {
    return new Promise<void>((resolve,reject) =>{
      try{
        let defaults = {center:[1.75, 47.5],zoom:5}
        options = { ...defaults, ...options }
        if (!maplibregl.supported() && process.client) {
          alert('Your browser does not support Maplibre GL')
        } else {
          this.$data[container] = new maplibregl.Map({
          container: container,
            style: process.env.NUXT_ENV_MAPLIBRE_STYLE,
            center: options.center,
            zoom: this.zoomMobile(options),
            attributionControl: options.attribution
          })
          if(options.controls){
            this.$data[container].addControl(new maplibregl.NavigationControl(), 'top-left')
          }
          resolve()
        }
      }
      catch(err){
        reject(err)
      }
    })
  }

  createDeck(container:any,options:Territory,layer:any,tooltip:any) {
    return new Promise<void>((resolve,reject) =>{
      try{
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
            this.$data['map_'+options.name].jumpTo({
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
        resolve()
      }
      catch(err){
        reject(err)
      }
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

  classColor(val:number, datas:Array<Analyse>) {
    const analysisClass = datas.map(d => d.val)
    const classe = analysisClass.reduce((prev, curr) => {
      return Math.abs(curr - val) > Math.abs(prev - val) ? prev : curr
    })
    return datas.find(d => d.val === classe)?.color || [0,0,0]
  }

  public classWidth(val:number, datas:Array<Analyse>) {
    const analysisClass = datas.map(d => d.val)
    const classe = analysisClass.reduce((prev, curr) => {
      return Math.abs(curr - val) > Math.abs(prev - val) ? prev : curr
    })
    return datas.find(d => d.val === classe)?.width
  }

  zoomMobile(options:Territory){
    if(!this.lgAndAbove && options.zoomMobile){
      return options.zoomMobile
    } else {
      return options.zoom
    }
  }
}
