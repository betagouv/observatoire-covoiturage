const state = {
  slider: [0,1000]
}

const mutations = {
  selectedSlider (state, response) {
    state.slider = response
  },
}

const actions = {

}

export default {
  state,
  mutations,
  actions
}
