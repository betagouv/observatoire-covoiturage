import { mapState} from "vuex"
export default {
  data() {
    return {
      window: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      breakpoint: ''
    }
  },
  computed:{
    ...mapState({
      screen: state => state.screen,
    }),
    lgAndAbove(){
      return this.includeInBreaks(['lg','xl'])
    }
  },
  methods:{
    handleResize() {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
      this.$store.commit('setWindow',this.window)
      if(this.window.width <= 576){
        this.breakpoint = 'xs'
      }
      else if (this.window.width > 576 && this.window.width <= 768) {
        this.breakpoint = 'sm'
      }
      else if (this.window.width > 768 && this.window.width <= 1024){
        this.breakpoint = 'md'
      }
      else if (this.window.width > 1024 && this.window.width <= 1248){
        this.breakpoint = 'lg'
      }
      else{
        this.breakpoint = 'xl'
      }
      this.$store.commit('setBreakpoint',this.breakpoint)
    },
    includeInBreaks(breaks){
      if (breaks.includes(this.screen.breakpoint)){
        return true
      } else {
        return false
      }
    },
    openSidebar(){
      this.$store.commit('setSidebarOpen',!this.screen.isSidebarOpen)
    },
    openLegend(){
      this.$store.commit('setLegendOpen',!this.screen.isLegendOpen)
    }
  }
}