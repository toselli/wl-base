import { useDisplay } from 'vuetify'

export default function useMobile() {
  const { mobile } = useDisplay({mobileBreakpoint: 820})
  return mobile
}