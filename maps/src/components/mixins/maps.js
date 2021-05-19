import maplibregl from 'maplibre-gl'
import {Deck} from '@deck.gl/core'
import geostats from 'geostats'
import Breakpoints from '@/components/mixins/breakpoints'

export default {
  mixins:[Breakpoints],
  data() {
    return {
      territories:[
        {
          name: "metropole",
          center: [2.087, 46],
          zoom: 5,
          zoomMobile: 4,
          controls: false,
        },
        {
          name: "antilles",
          center: [-61.3367, 15.372],
          zoom: 6,
        },
        {
          name: "guyane",
          center: [-53.097, 3.83],
          zoom: 5,
          zoomMobile: 4,
        },
        {
          name: "mayotte",
          center: [45.167, -12.8503],
          zoom: 8,
        },
        {
          name: "reunion",
          center: [55.5155, -21.0883],
          zoom: 7,
        }
      ],
      isHovering:false
    }
  },
  methods:{
    createMap(container,options) {
      return new Promise((resolve,reject) =>{
        try{
          let defaults = {center:[1.75, 47.5],zoom:5}
          options = { ...defaults, ...(options || {}) }
          if (!maplibregl.supported()) {
            alert('Your browser does not support Maplibre GL')
          } else {
            this[container] = new maplibregl.Map({
            container: container,
              style: process.env.VUE_APP_MAPLIBRE_STYLE,
              center: options.center,
              zoom: this.zoomMobile(options),
              interactive: false,
            })
            if(options.controls){
              this[container].addControl(new maplibregl.NavigationControl(), 'top-left')
            }
            resolve()
          }
        }
        catch(err){
          reject(err)
        }
      })
    },
    createDeck(container,options,layer) {
      return new Promise((resolve,reject) =>{
        try{
          // empêche le menu contextuel de s'ouvrir sur le clic droit
          document.getElementById(container)
          .addEventListener("contextmenu", e => e.preventDefault())
          
          this[container] = new Deck({
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
              this['map_'+options.name].jumpTo({
                center: [viewState.longitude, viewState.latitude],
                zoom: viewState.zoom,
                bearing: viewState.bearing,
                pitch: viewState.pitch
              })
            },
            onHover: ({object}) => (this.isHovering = Boolean(object)),
            getCursor: ({isDragging}) => (isDragging ? 'grabbing' : (this.isHovering ? 'pointer' : 'grab')),
            layers:[layer],
            getTooltip: ({object}) => object && {
              html: this.tooltip(object),
              className:'fr-callout',
              style: {
                color:'#000',
                backgroundColor: '#fff',
                fontSize: '0.8em',
                width:'250px',
                height:'110px',
                left:'-125px',
                top:'-110px'
              }
            }
          })
          resolve()
        }
        catch(err){
          reject(err)
        }
      })
    },
    hexToRgb(hex) {
      return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(m, r, g, b) => '#' + r + r + g + g + b + b)
      .substring(1).match(/.{2}/g)
      .map(x => parseInt(x, 16))
    },
    jenks(data,field,colors,width){
      const vals = new geostats(data.map(d => d[field]))
      let breaks = vals.getClassJenks(width.length - 1)
      let analysis = breaks.map((b,i) => {
        return {val:b,color:this.hexToRgb(colors[i]),width:width[i]} 
      })
      return analysis
    },
    classColor(val, datas) {
      const analysisClass = datas.map(d => d.val)
      const classe = analysisClass.reduce(function (prev, curr) {
        return Math.abs(curr - val) > Math.abs(prev - val) ? prev : curr
      })
      return datas.find(d => d.val === classe).color
    },
    classWidth(val, datas) {
      const analysisClass = datas.map(d => d.val)
      const classe = analysisClass.reduce(function (prev, curr) {
        return Math.abs(curr - val) > Math.abs(prev - val) ? prev : curr
      })
      return datas.find(d => d.val === classe).width
    },
    zoomMobile(options){
      if(!this.lgAndAbove && options.zoomMobile){
        return options.zoomMobile
      } else {
        return options.zoom
      }

    }
  }
}