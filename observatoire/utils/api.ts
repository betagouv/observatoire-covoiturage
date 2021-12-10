import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { getEnv } from './getEnv';

let $axios: NuxtAxiosInstance

export function initializeAxios (axiosInstance: NuxtAxiosInstance) {
  const apiUrl = getEnv('apiUrl');
  if (apiUrl !== '') {
    $axios = axiosInstance.create({
      baseURL: apiUrl
    });
  } else {
    $axios = axiosInstance;
  }
}

export { $axios }