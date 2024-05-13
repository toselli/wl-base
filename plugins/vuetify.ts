import { createVuetify } from 'vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { md } from 'vuetify/lib/iconsets/md'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import {ThemeLight, ThemeDark} from '~/custom/themes.js'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
        md
      }
    },
     theme: {
      themes: {
        ThemeDark, ThemeLight
      },
      defaultTheme: 'ThemeLight',
    }

  })

  nuxtApp.vueApp.use(vuetify)
})
