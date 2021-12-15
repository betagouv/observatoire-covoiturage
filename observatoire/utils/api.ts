import { NuxtAxiosInstance } from '@nuxtjs/axios'

let $axios: NuxtAxiosInstance

export function initializeAxios (axiosInstance: NuxtAxiosInstance, url:string) {
  $axios = axiosInstance.create({
    baseURL: url
  });
}

export { $axios }