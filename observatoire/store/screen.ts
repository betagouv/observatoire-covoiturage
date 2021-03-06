import { MutationTree } from 'vuex'

export const state = () => ({
  window:{
    width: 0,
    height: 0
  },
  breakpoint:'xl',
  isMenuOpen:false,
  isSidebarOpen:false,
  isLegendOpen:false
})

export type ScreenState = ReturnType<typeof state>

export const mutations: MutationTree<ScreenState> = {
  setWindow: (state, val: {width: number, height: number}) => (
    state.window = val
  ),
  setBreakpoint: (state, val: string) => (
    state.breakpoint = val
  ),
  setMenuOpen: (state, val: boolean) => (
    state.isMenuOpen = val
  ),
  setSidebarOpen: (state, val: boolean) => (
    state.isSidebarOpen = val
  ),
  setLegendOpen: (state, val: boolean) => (
    state.isLegendOpen = val
  )
}