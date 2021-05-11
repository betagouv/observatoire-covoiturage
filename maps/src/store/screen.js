const state = {
  window: {
    width: 0,
    height: 0
  },
  breakpoint: ''
}

const mutations = {
  setWindow: (state, response) => {
    state.window = response
  },
  setBreakpoint: (state, response) => {
    state.breakpoint = response
  },
}

export default {
  state,
  mutations
}
