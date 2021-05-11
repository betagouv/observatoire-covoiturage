import maplibregl from 'maplibre-gl'
import {Deck} from '@deck.gl/core'
import geostats from 'geostats'

export default {
  data() {
    return {
      territories:[
        {
          name: "metropole",
          center: [2.087, 46],
          zoom: 5,
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
              zoom: options.zoom,
              interactive: false,
            })
            if(options.controls){
              this[container].addControl(new maplibregl.NavigationControl(), 'top-left')
            }
            /*this[container].on(["load"], () => {
              const { lat, lng } = this[container].getCenter()
              const newViewState = {
                longitude: lng,
                latitude: lat,
                zoom: this[container].getZoom(),
                bearing: this[container].getBearing()
              }
              this['deck_'+options.name].setProps({ viewState: newViewState })
            })*/
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
              zoom: options.zoom,
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
              html: `<div class="tooltip-title"><b>${object.l_com1} - ${object.l_com2}</b></div>
              <div>Véhicules : ${object.vehicles}</div>
              <div>Passagers : ${object.passengers}</div>
              <div>${((object.passengers + object.vehicles)/object.vehicles).toFixed(1)} personnes par véhicules</div>`,
              className:'fr-callout',
              style: {
                color:'#000',
                backgroundColor: '#fff',
                fontSize: '0.8em',
                width:'250px',
                height:'130px',
                left:'-125px',
                top:'-130px'
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
    }
  }
}