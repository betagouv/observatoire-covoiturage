import maplibregl from 'maplibre-gl'

export default {
  data(){
    return {
      map: null
    }
  },
  methods:{
    async init(){
      this.createMap('map_metropole')
    },
    createMap(container = 'map',options) {
      let defaults = { style:process.env.VUE_APP_MAPLIBRE_STYLE,center:[1.75, 47.5],zoom:5 }
      options = { ...defaults, ...(options || {}) }
      if (!maplibregl.supported()) {
        alert('Your browser does not support Maplibre GL')
      } else {
        this.map = new maplibregl.Map({
         container: container,
          style: options.style,
          center: options.center,
          zoom: options.zoom,
        })
        this.map.addControl(new maplibregl.NavigationControl(), 'top-left')
      }
    }
  }
}