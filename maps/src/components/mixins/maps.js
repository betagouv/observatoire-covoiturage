import maplibregl from 'maplibre-gl'
import {Deck} from '@deck.gl/core'
import axios from 'axios'
import {ArcLayer} from '@deck.gl/layers'

export default {
  data() {
    return {
      flux:null,
      map_metropole:null,
      map_antilles:null,
      map_guyane:null,
      map_mayotte:null,
      map_reunion:null,
      deck_metropole:null,
      deck_antilles:null,
      deck_guyane:null,
      deck_mayotte:null,
      deck_reunion:null,
      territories:[
        {
          name: "metropole",
          center: [2.087, 46],
          zoom: 5,
          controls: true,
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
      ]
    }
  },
  methods:{
    async createMap(container,options) {
      return new Promise(resolve => {
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
          })
          if(options.controls){
            this[container].addControl(new maplibregl.NavigationControl(), 'top-left')
          }
        }
        resolve()
      })
    },
    async getData(){
      const response = await axios.get('http://localhost:8080/v1/monthly_flux')
      this.flux = response.data
    },
    async createDeck(container,options) {
      return new Promise(resolve => {
        this[container] = new Deck({
          canvas: container,
          width: '100%',
          height: '100%',
          initialViewState: {
            latitude: options.center[1],
            longitude:options.center[0],
            zoom: options.zoom,
            bearing: 0,
            pitch: 30
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
          layers:[
            new ArcLayer({
              id: 'flux-layer',
              data:this.flux,
              pickable: true,
              getWidth: 5,
              getSourcePosition: d => [d.com1_lng,d.com1_lat],
              getTargetPosition: d => [d.com2_lng,d.com2_lat],
              getSourceColor: [0, 128, 200],
              getTargetColor: [200, 0, 80],
            })
          ]
        })
        resolve()
      })
    },
    renderMaps() {
      for (let territory of this.territories) {
        this.createMap('map_'+territory.name,territory)
        this.createDeck('deck_'+territory.name,territory)
      }
    }
  }
}