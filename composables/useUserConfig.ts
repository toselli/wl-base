export function useUserConfig() {
  const configStore = useConfigStore()
  const loading = ref(false)
  const error = ref(null)

  async function initializeUserConfig(userId) {
    loading.value = true
    error.value = null
    try {
      await configStore.fetchConfig(userId)
      if (!configStore.getConfig) {
        const defaultConfig = {
          theme: 'ThemeLight',
          notifications: true,
          autoOrderbyPrice: false,
          lastPlacesSearched: []
        }
        await configStore.saveConfig(userId, defaultConfig)
      }
    } catch (err) {
      error.value = err
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function updateUserConfig(userId, newConfig) {
    loading.value = true
    error.value = null
    try {
      await configStore.saveConfig(userId, newConfig)
      await configStore.fetchConfig(userId)
    } catch (err) {
      error.value = err
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    initializeUserConfig,
    updateUserConfig,
    loading,
    error
  }
}
