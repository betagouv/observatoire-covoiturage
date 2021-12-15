import { Plugin } from '@nuxt/types'
import { initializeAxios } from '../utils/api'

const accessor: Plugin = ({ $axios, store }) => {
  initializeAxios($axios,store.state.env.url_api)
}

export default accessor