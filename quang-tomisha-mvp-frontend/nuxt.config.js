import fs from 'fs'
import path from 'path'
import env from 'dotenv'

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
const DEFAULT_PAGE_TITLE = 'Hier findest Du Deinen Job mit nur einem Click'
const DEFAULT_DESCRIPTION =
  'Hier findest Du Deinen Job mit nur einem Click. Suchst du einen neuen Job, findest du ihn hier auf deiner Jobplattform. Finde Deinen Job aus täglich neu eingestellten Stellenangeboten und bewirb Dich direkt über das Jobportal.'
const HOST =
  process.env.NODE_ENV === 'development'
    ? 'localhost'
    : process.env.NODE_ENV === 'production'
    ? 'https://tomisha.com'
    : 'https://tomisha.io'
const DEFAULT_SUMMARY_IMG = HOST + '/img/meta.png'

env.config({
  path: fs.existsSync(envPath) ? envPath : path.resolve(process.cwd(), '.env'),
})

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    htmlAttrs: {
      lang: 'de',
    },
    title: DEFAULT_PAGE_TITLE,
    titleTemplate: 'Tomisha | %s',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      { hid: 'description', name: 'description', content: DEFAULT_DESCRIPTION },

      // Open Graph / Facebook
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: DEFAULT_PAGE_TITLE,
      },
      { hid: 'og:title', property: 'og:title', content: DEFAULT_PAGE_TITLE },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:image', property: 'og:image', content: DEFAULT_SUMMARY_IMG },
      {
        hid: 'og:description',
        property: 'og:description',
        content: DEFAULT_DESCRIPTION,
      },

      // Twitter
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: DEFAULT_PAGE_TITLE,
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: DEFAULT_SUMMARY_IMG,
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: DEFAULT_DESCRIPTION,
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        id: 'cookieyes',
        type: 'text/javascript',
        src:
          'https://cdn-cookieyes.com/client_data/f09f40633f2b8e06d8762845.js',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/main.scss'], // 'flag-icon-css/css/flag-icon.css'
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/utils',
    '~/plugins/validation',
    '~/plugins/seo',
    '~/plugins/axios-interceptors',
    '~/plugins/repositories',
    '~/plugins/auth',
    '~/plugins/transition',
    '~/plugins/screen',
    '~/plugins/vh.client',
    '~/plugins/alert.client',
    '~/plugins/confirm.client',
    '~/plugins/file-input.client',
    '~/plugins/upload.client',
    '~/plugins/gtag.client',
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: [
    { path: '~/components/', extensions: ['vue'], pathPrefix: false },
    { path: '~/components/base/', extensions: ['vue'], prefix: 'base' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    ['@nuxtjs/eslint-module', { fix: true }],
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    ['@nuxtjs/tailwindcss', { viewer: false }],
    // Doc: https://github.com/nuxt-community/svg-module
    '@nuxtjs/svg',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',

    '@nuxtjs/device',

    // https://github.com/nuxt-community/dayjs-module
    [
      '@nuxtjs/dayjs',
      {
        locales: ['de'],
        defaultLocale: 'de',
      },
    ],

    // https://axios.nuxtjs.org/options
    [
      '@nuxtjs/axios',
      {
        baseURL: process.env.NUXT_ENV_API_BASE_URL,
        browserBaseURL: process.env.NUXT_ENV_API_BROWSER_BASE_URL,
      },
    ],

    [
      '@nuxtjs/robots',
      {
        // Sitemap: process.env.NUXT_ENV_HOST + '/sitemapindex.xml.gz',
        Disallow: process.env.NODE_ENV !== 'production' ? '/' : '',
      },
    ],

    '@nuxtjs/sentry',
  ],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    // analyze: true,
    transpile: ['@hcaptcha/vue-hcaptcha'],
    analyze: process.env.NODE_ENV === 'development',
  },

  server: {
    host: '0.0.0.0',
    port: 3300,
  },

  router: {
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link',
    middleware: ['auth'],
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'fallback-all',
        path: '*',
        component: resolve(__dirname, 'pages/profile.vue'),
      })
    },
  },

  sentry: {
    dsn:
      'https://aaa94336080f4c128f8ae81d4a7fad7d@o568099.ingest.sentry.io/5712844',
    lazy: true,
    disabled: false,
    config: {
      environment: process.env.NODE_ENV,
    },
    tracing: true,
    clientConfig: {
      beforeSend(event) {
        return event
      },
    },
  },
}
