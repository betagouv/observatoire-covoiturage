const state = {
  window: {
    width: 0,
    height: 0
  },
  breakpoint: '',
  isMenuOpen:false,
  isSidebarOpen:false,
  isLegendOpen:false,
}

const mutations = {
  setWindow: (state, response) => {
    state.window = response
  },
  setBreakpoint: (state, response) => {
    state.breakpoint = response
  },
  setMenuOpen: (state, response) => {
    state.isMenuOpen = response
  },
  setSidebarOpen: (state, response) => {
    state.isSidebarOpen = response
  },
  setLegendOpen: (state, response) => {
    state.isLegendOpen = response
  },
}

export default {
  state,
  mutations
}
