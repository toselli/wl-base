import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { md } from 'vuetify/lib/iconsets/md'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

import {ThemeLight, ThemeDark} from '~/custom/themes.js'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components: {
      ...components,
    },
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
        md
      }
    },
    theme: {
      defaultTheme: 'ThemeLight',
      themes: {
        ThemeDark, ThemeLight
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})