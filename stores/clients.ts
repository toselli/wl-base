export const useClientsStore = defineStore("clients", () => {
    //state
    const clients = ref([])

    //getters
    const getClients = computed(() => clients.value)


    function autocompleteClients(payload: string): Promise<any> {
        return new Promise((resolve, reject) => {
            useClients.get<any>('v1/clients', null, payload)
                .then((res: any) => {
                    clients.value = res.value
                    resolve(res)
                }, error => {
                    reject(error)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    };

    function fetchClients(filter: object): Promise<any> {
        return new Promise((resolve, reject) => {
            useClients.get<any>('v1/clients', {}, filter)
                .then((res: any) => {
                    clients.value = res
                    resolve(res)
                }, error => {
                    reject(error)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    };

    function changeClientSeller(payload: any) {
        return new Promise((resolve, reject) => {
          useEbooking.get('basketManager/changeAgencyUser', null, payload)
            .then((res: any) => {
              resolve(res)
            })
            .catch((error) => {
              console.log(error)
              reject()
            })
        })
      }



    return { getClients, autocompleteClients, fetchClients, changeClientSeller }

})