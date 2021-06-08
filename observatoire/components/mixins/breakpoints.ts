import { Component,Vue } from 'nuxt-property-decorator'

@Component
export default class BreakpointsMixin extends Vue {
  window = {
    width: 0,
    height: 0
  }
  breakpoint = ''

  get lgAndAbove(){
    return this.includeInBreaks(['lg','xl'])
  }

  public handleResize() {
    this.window.width = window.innerWidth
    this.window.height = window.innerHeight
    this.$store.commit('screen/setWindow',this.window)
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
    this.$store.commit('screen/setBreakpoint', this.breakpoint)
  }

  public includeInBreaks(breaks:string[]){
    if (breaks.includes(this.$store.state.screen.breakpoint)){
      return true
    } else {
      return false
    }
  }

  public openMenu(){
    this.$store.commit('setMenuOpen',!this.$store.state.screen.isMenuOpen)
  }

  public openSidebar(){
    this.$store.commit('setSidebarOpen',!this.$store.state.screen.isSidebarOpen)
  }

  public openLegend(){
    this.$store.commit('setLegendOpen',!this.$store.state.screen.isLegendOpen)
  }

}