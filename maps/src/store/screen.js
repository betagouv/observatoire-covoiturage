const state = {
  window: {
    width: 0,
    height: 0
  },
  device: ''
}

const mutations = {
  setWindow: (state, response) => {
    state.window = response
  },
  setDevice: (state, response) => {
    state.device = response
  },
}

export default {
  state,
  mutations
}
