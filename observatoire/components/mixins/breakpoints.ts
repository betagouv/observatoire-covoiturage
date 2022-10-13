import { Component,Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { ScreenState } from 'store/screen'

@Component({
  computed:{
    ...mapState({
      screen: 'screen',
    })
  }
})
export default class BreakpointsMixin extends Vue {
  screen!: ScreenState 
  get lgAndAbove(){
    return this.includeInBreaks(['lg','xl'])
  }

  public handleResize() {
    this.$store.commit('screen/setWindow', { width: window.innerWidth, height: window.innerHeight})
    if(window.innerWidth <= 576){
      this.$store.commit('screen/setBreakpoint', 'xs')
    }
    else if (window.innerWidth > 576 && window.innerWidth <= 768) {
      this.$store.commit('screen/setBreakpoint', 'sm')
    }
    else if (window.innerWidth > 768 && window.innerWidth <= 1024){
      this.$store.commit('screen/setBreakpoint', 'md')
    }
    else if (window.innerWidth > 1024 && window.innerWidth <= 1248){
      this.$store.commit('screen/setBreakpoint', 'lg')
    }
    else{
      this.$store.commit('screen/setBreakpoint', 'xl')
    }
  }

  public includeInBreaks(breaks:string[]){
    if (breaks.includes(this.$store.state.screen.breakpoint)){
      return true
    } else {
      return false
    }
  }

  public openMenu(){
    this.$store.commit('screen/setMenuOpen',!this.$store.state.screen.isMenuOpen)
  }

  public openSidebar(){
    this.$store.commit('screen/setSidebarOpen',!this.$store.state.screen.isSidebarOpen)
  }

  public openLegend(){
    this.$store.commit('screen/setLegendOpen',!this.$store.state.screen.isLegendOpen)
  }

}