import { useTheme } from 'vuetify'

export function useThemeManager() {
    const theme = ref(useTheme())
    const activeTheme = ref(theme.value.global.dark ? 'ThemeDark' : 'ThemeLight')

    function applyThemeConfig(newTheme) {
        if(newTheme == 'ThemeDark') {
            theme.value.global.current.dark = true
        } else {
            theme.value.global.current.dark = false
        }
        theme.value.global.name = newTheme        
        activeTheme.value = newTheme

    }

    return { theme, activeTheme, applyThemeConfig }
}
