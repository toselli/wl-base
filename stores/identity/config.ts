import { useFirestore } from 'vuefire'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

export const useConfigStore = defineStore("config", () => {
  // State
  const _db = useFirestore()
  const config = ref(null)
  
  // Getters
  const getConfig = computed(() => config.value)

  const configCollection = collection(_db, 'users_config');
  // Actions
  async function fetchConfig(id) {
    try {
      const docRef = doc(configCollection, id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        config.value = docSnap.data()
      } else {
        console.error("No hay configuración de usuario!")
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function saveConfig(id, payload) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const docRef = doc(configCollection, String(id))
        await setDoc(docRef, payload, { merge: true })
        resolve()
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  return { config, getConfig, fetchConfig, saveConfig }
})