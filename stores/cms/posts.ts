import { useFirestore } from 'vuefire'
import { collection, doc, query, where, orderBy, getDocs, getDoc, DocumentReference } from 'firebase/firestore'

export const usePostsStore = defineStore("posts", () => {
  // State
  const _db = useFirestore()
  const posts = ref([])
  const selectedPost = ref({});
  
  // Getters
  const getPosts = computed(() => posts.value)
  const getPost = computed(() => selectedPost.value)

  // Actions
  async function fetchPosts() { 
    try {
      const q = query(collection(_db, 'posts'), where('active', '==', true), orderBy('createdAt', 'desc'));
      const results = await getDocs(q);
      posts.value = results.docs.map(doc => {
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

  async function fetchPostById(id: string) {
    try {
      const postDoc = doc(_db, 'posts', id);
      const postSnapshot = await getDoc(postDoc);
      console.log("postSnapshot.exists():", postSnapshot.exists());
      console.log("postSnapshot.data():", postSnapshot.data());
  
      if (postSnapshot.exists()) {
        selectedPost.value = postSnapshot.data();
      } else {
        console.error(`No se encontró un post con el ID: ${id}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  return { posts, getPosts, getPost, fetchPosts, fetchPostById }
})