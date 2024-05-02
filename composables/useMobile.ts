import { useDisplay } from 'vuetify'

export default function useMobile() {
  const { mobile } = useDisplay({mobileBreakpoint: 1230})
  return mobile
}