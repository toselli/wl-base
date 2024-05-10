import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { md } from 'vuetify/lib/iconsets/md'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const ThemeLight = {
  dark: false,
  colors: {
    primary_text: '#212C3D',
    secondary_text: '#5C6E8A',
    border: '#A9B7CC',
    background: '#F1F4F9',
    midground: '#FAFCFF',
    foreground: '#FFFFFF',
    primary: '#F05C22',
    primary_hover: '#FF6C33',
    primary_active: '#F9B99F',
    primary_lighten_hover: '#FED4C3',
    primary_lighten: '#FDE7DE',
    secondary_darken: '#2E456B',
    secondary: '#0E63F1',
    secondary_hover: '#5C99FF',
    secondary_active: '#9FC2F9',
    secondary_lighten_hover: '#CFE0FC',
    secondary_lighten: '#E3EDFD',
    error: '#FE504F',
    error_map: '#FFB0B0',
    error_lighten: '#FFE5E5',
    success: '#0BAA58',
    success_map: '#A3E8D1',
    success_lighten: '#E0F7F0',
    warning: '#FA7516',
    warning_map: '#FDC196',
    warning_lighten: '#FEEADC',
    yellow: '#F6C506',
    yellow_map: '#FCF298',
    yellow_lighten: '#FEFBDD',
    accent: '#FF8F00',
    shade_light: '#FFFFFF',
    shade_dark: '#0A1129'
  }
}
const ThemeDark = {
  dark: true,
  colors: {
    primary_text: '#EFF3F8',
    secondary_text: '#A0ABBB',
    border: '#737D8C',
    background: '#000000',
    midground: '#111213',
    foreground: '#1D1F20',
    primary: '#F07342',
    primary_hover: '#ED622C',
    primary_active: '#F9B99F',
    primary_lighten_hover: '#5F3423',
    primary_lighten: '#32211A',
    secondary_darken: '#B2CFFF',
    secondary: '#4285F4',
    secondary_hover: '#5C99FF',
    secondary_active: '#9FC2F9',
    secondary_lighten_hover: '#223A62',
    secondary_lighten: '#182335',
    error: '#ED5E65',
    error_map: '#743438',
    error_lighten: '#321D1F',
    success: '#22C370',
    success_map: '#19623D',
    success_lighten: '#142D21',
    warning: '#F58A3D',
    warning_map: '#774826',
    warning_lighten: '#332419',
    yellow: '#DDCD3C',
    yellow_map: '#6D6625',
    yellow_lighten: '#302E19',
    accent: '#F5A43D',
    shade_light: '#FFFFFF',
    shade_dark: '#0A1129'
  }
}



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
    defaults: {
      VBtn: {
        style: 'text-transform: none; font-family: font-size: 0.875rem !important; letter-spacing: normal !important;',
      },
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