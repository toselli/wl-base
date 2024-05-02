import { capitalize } from "vue";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      sentence: (str: string) => {
        str = str.toLowerCase();
        const words = []
        for(let word of str.split(' ')) {
          words.push(capitalize(word))
        }
        return words.join(' ')
      },
      capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
      uppercase: (str: string) => str.toUpperCase()
    }
  }
})