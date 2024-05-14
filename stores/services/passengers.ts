export const usePassengersStore = defineStore("passengers", () => {

  //state
  const passengerData = ref([])

  //getters
  const getPassengerData = computed(() => passengerData.value) 



  function fetchPassengerData(payload: any) {
    return new Promise((resolve, reject) => {
        useEbooking.get('passengers/getPassengerByDocument', null, payload)
          .then((res: any) => {
            passengerData.value = res
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
  }

  return { passengerData, getPassengerData, fetchPassengerData}

})