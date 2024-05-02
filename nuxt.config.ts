export default defineNuxtConfig({
  css: ['vuetify/styles', '~/assets/custom.scss'],
  build: {
    transpile: ['vuetify'],
  },
  pages: true,
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'ebooking v5 - BETA',
      meta: [
        // <meta name="description" content="My amazing site">
        { name: 'description', content: 'Ebooking es un motor de reservas turísticas online para agencias' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1' },
        { name: 'keywords', content: 'reservas,turismo,hoteles' },
        { name: "og:image", content: '' },
        { name: "theme-color", content: '#F05C22' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/img/favicon.png' },
        { rel: 'apple-touch-icon', type: 'image/png', href: '/img/favicon.png' },
        { rel: 'mask-icon', type: 'image/png', href: '/img/favicon.png' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    ssr: {
      noExternal: ['vuetify', 'v-phone-input'], // add the vuetify vite plugin
    },
    optimizeDeps: {
   //   include: ['vuetify/lib/framework'],
      exclude: ['fsevents'] 
    },
    resolve: {
      // alias: {
      //   'vue': 'vue/dist/vue.esm-bundler.js',
      // }
    },
    cacheDir: '.vite-cache',
  },
  modules: [
    'nuxt-vuefire',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'nuxt3-leaflet',
    '@vite-pwa/nuxt'
  ],
  devtools: { enabled: false },
  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCj0sR2ldnTpOMP9lz6WG-Cq48WGwv7hvA",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "ebooking-web.firebaseapp.com",
      projectId: process.env.FIREBASE_PROJECT_ID || "ebooking-web",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "ebooking-web.appspot.com",
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "116153973786",
      appId: process.env.FIREBASE_APP_ID || "1:116153973786:web:575fe20badf7eb30fae5a3",
      measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-H0YRS3DEYZ",
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://ebooking-web-default-rtdb.firebaseio.com"
    }
  },
  pwa: {
    manifest: {
      theme_color: "#F05C22",
      background_color: "#FFFFFF",
      display: "standalone",
      name: "ebooking",
      short_name: "ebooking",
      description: "ebooking App",
      icons: [
        {
          "src": "/icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/icons/icon-256x256.png",
          "sizes": "256x256",
          "type": "image/png"
        },
        {
          "src": "/icons/icon-384x384.png",
          "sizes": "384x384",
          "type": "image/png"
        },
        {
          "src": "/icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: false,
      type: 'module'
    }
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  i18n: {
    vueI18n: './utils/nuxt-i18n.js' // custom path example
  },
  runtimeConfig: {
    public: {
      ebookingApi5: process.env.EBOOKING_API5 || "https://ebooking5.juantoselli.com/api/",
      ebookingWs: process.env.EBOOKING_WS || "https://ebooking5.juantoselli.com/ws",
      historical: process.env.EBOOKING_STATS_URL,
      ebookingApi: process.env.EBOOKING_API || "https://api.juantoselli.com/api/",
      identityApi: process.env.IDENTITY_URL || "https://identity.juantoselli.com/api/",
      clientsApi: process.env.CLIENTS_URL || "https://clients.juantoselli.com/api/",
      cloudMessagingApi:  process.env.CLOUD_MESSAGING_URL || "https://notifications.juantoselli.com/api/",
      websiteId: process.env.WEBSITE_ID || '540b0fb929116d03c81eb99b',
      ownerId: process.env.OWNER_ID || '540b0fb929116d03c81eb99a',
      agencyId: process.env.AGENCY_ID || '540b0fb929116d03c81eb99a',
      ebookingCdn: process.env.CDN_URL || 'https://api.juantoselli.com/public/',
      searchTime: process.env.SEARCH_TIME || '15000'
    }
  }
})