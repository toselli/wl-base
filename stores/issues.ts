import { useFirestore } from 'vuefire'
import { collection, doc, query, where, orderBy, getDocs, getDoc, addDoc } from 'firebase/firestore'
import { useFirebaseStorage, useStorageFile } from 'vuefire'

export const useIssuesStore = defineStore("issues", () => {
  // State
  const _db = useFirestore()
  const issues = ref([])
  const selectedIssue = ref({});
  
  // Getters
  const getIssues = computed(() => issues.value)
  const getIssue = computed(() => selectedIssue.value)
  const issuesCollection = collection(_db, 'issues');
  // Actions
  async function fetchIssues() {
    try {
      const q = query(issuesCollection, where('active', '==', true), orderBy('createdAt', 'desc'));
      const results = await getDocs(q);
      issues.value = results.docs.map(doc => {
        const data = doc.data();
        // Agregar el ID del documento al objeto del post
        return {
          id: doc.id, // Aquí obtenemos el ID del documento
          ...data,    // Mantenemos el resto de los datos del documento
        };
      });
    } catch (error) {
      console.error(error)
    }
  }

  async function createIssue(payload: object) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await addDoc(issuesCollection, 
          payload
        );
        resolve()
      }
      catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }


  async function fetchIssueById(id: string) {
    try {
      const postDoc = doc(_db, 'issues', id);
      const postSnapshot = await getDoc(postDoc);
      if (postSnapshot.exists()) {
        selectedIssue.value = postSnapshot.data();
      } else {
        console.error(`No se encontró un issue con el ID: ${id}`);
      }
    } catch (error) {
      console.error(error);
    }
  }


  return { issues, getIssues, getIssue, fetchIssues, fetchIssueById, createIssue }
})