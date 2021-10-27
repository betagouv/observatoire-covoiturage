export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  publicRuntimeConfig: {
    url_app: process.env.URL_APP,
    url_api: process.env.URL_API,
    map_style: process.env.MAPLIBRE_STYLE
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Observatoire national du covoiturage au quotidien',
    htmlAttrs: {
      lang: 'fr'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { property: 'og:site_name', content: 'Observatoire national du covoiturage au quotidien' },
      { hid: 'og:type', property: "og:type", content: "website" },
      { hid: 'og:url', property: "og:url", content: "" },
      { hid: 'og:title', property: "og:title", content: "Observatoire national du covoiturage au quotidien"},
      { hid: "og:description", property: "og:description", content: ""},
      { hid: "og:image", property: "og:image", content: "/images/map.png"},
      { property: "og:image:width", content: "740" },
      { property: "og:image:height", content: "300" },
      { name: "twitter:site", content: "@Covoitbetagouv" },
      { name: "twitter:card", content: "summary_large_image" },
      { hid: "twitter:url", name: "twitter:url", content: ""},
      { hid: "twitter:title", name: "twitter:title", content: "Observatoire national du covoiturage au quotidien"},
      { hid: "twitter:description", name: "twitter:description", content: ""},
      { hid: "twitter:image", name: "twitter:image", content: "/images/map.png" }
    ],
    link: [
      { rel: 'apple-touch-icon', size: '180x180', href: '/favicons/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' },
      { rel: 'manifest', href: '/favicons/site.webmanifest' },
      { hid: "canonical", rel: "canonical", href: "" }
    ],
    script: [
      { hid: 'module', type:'module', src:'/js/dsfr.module.min.js',defer:true,body:true},
      { hid: 'nomodule', nomodule:true, src: '/js/dsfr.nomodule.min.js',defer:true,body:true},
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/scss/main'
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/axios-accessor.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'nuxt-buefy',
    ['nuxt-matomo', { doNotTrack: true, matomoUrl: 'https://stats.data.gouv.fr/', siteId: 166, cookies: false }],
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL:process.env.URL_API
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    fullTextSearchFields: ['title', 'description','text']
  },
  buefy: { css:false },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    splitChunks: {
      layouts: true
    }
  }
}
