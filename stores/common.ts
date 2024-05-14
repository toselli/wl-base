import { useFirestore } from 'vuefire'
import { collection, addDoc } from 'firebase/firestore';


export const useCommonStore = defineStore("common", () => {
  //state
  const _db = useFirestore()
  
  //getters

  //actions
  async function sendMail(payload: object) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const mailCollection = collection(_db, 'mails');  
        await addDoc(mailCollection, {
          to: payload.to,
          message: {
            text: payload.text,
            subject: payload.subject,
            html: payload.html
          },
        });
      }
      catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  return { sendMail }
})