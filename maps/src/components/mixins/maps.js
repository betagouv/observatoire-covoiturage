import maplibregl from 'maplibre-gl'

export default {
  data() {
    return {
      map_metropole:null,
      map_antilles:null,
      map_guyane:null,
      map_mayotte:null,
      map_reunion:null,
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
    createMap(container,options) {
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
        this[container].scrollZoom.disable()
      }
    },
    init() {
      for (let territory of this.territories) {
        this.createMap('map_'+territory.name,territory)
      }
    }
  }
}