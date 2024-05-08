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
    primary_text: '#15373D',
    secondary_text: '#52757A',
    border: '#B2C9CC',
    background: '#E8F5F7',
    midground: '#F5FEFF',
    foreground: '#FFFFFF',
    primary: '#24A8BC',
    primary_hover: '#18CBE7',
    primary_active: '#90E7F4',
    primary_lighten_hover: '#B1F1FB',
    primary_lighten: '#CCF4FA',
    secondary_darken: '#988C01',
    secondary: '#F8E725',
    secondary_hover: '#FFF47A',
    secondary_active: '#FDF7BA',
    secondary_lighten_hover: '#FDF9CE',
    secondary_lighten: '#FEFBE2',
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
    primary: '#F05C22',
    primary_hover: '#EFF3F8',
    primary_active: '#BFC9D9',
    primary_lighten_hover: '#52565C',
    primary_lighten: '#444A53',
    secondary_darken: '#146DFF',
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
    accent: '#F5A43D',
    yellow: '#DDCD3C',
    yellow_map: '#6D6625',
    yellow_lighten: '#302E19',
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