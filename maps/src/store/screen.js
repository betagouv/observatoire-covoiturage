const state = {
  window: {
    width: 0,
    height: 0
  },
  breakpoint: '',
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
