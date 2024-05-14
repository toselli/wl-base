import { Ref } from "nuxt/dist/app/compat/capi";

export const useTransfersStore = defineStore("transfers", () => {
  //state
  const results = ref({
    transfersIn: [],
    transfersOut: []
  })
  const features = ref([])
  const searchToken = ref('')
  const basketId = ref('')
  const preBooking: Ref<any> = ref({})
  const airlines = ref([])

  //getters
  const getResults = computed(() => results.value)
  const getFeatures = computed(() => features.value)
  const getPrebooking = computed(() => preBooking.value)


  //actions
  function search(payload: Object) {
    return new Promise((resolve, reject) => {
      useEbooking.post('transferService/search', null, payload)
        .then((res: any) => {
          results.value.transfersIn.push(...res.ServicesIn);
          results.value.transfersOut.push(...res.ServicesOut);
          basketId.value = res.BasketId
          features.value = res.Features
          resolve(res)
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
    })
  };
  function addService(payload: any) {
    return new Promise((resolve, reject) => {
      useEbooking.post('transferService/addServices', null, payload)
        .then((res) => {
            resolve(res)
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
    })
  };
  function getBasket(payload: any) {
    return new Promise((resolve, reject) => {
      useEbooking.get('transferService/getBasketServices', null, payload)
        .then((res: any) => {
          preBooking.value = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  };
  function updateServices(payload: any) {
    return new Promise((resolve, reject) => {
      useEbooking.post('transferService/updateServices', null, payload)
        .then((res: any) => {
          resolve(res)
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
    })
  };
  function processPayment(payload: any) {
    return new Promise((resolve, reject) => {
      useEbooking.post('payments/paymentRequestUSD', null, payload)
        .then((res: any) => {
          if(res && res.FormData) {
            resolve(res.FormData)
          }
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
  function getCancellationPolicies(payload: object) {
    return new Promise((resolve, reject) => {
      useEbooking.get('transferService/getCancelationPolicies', null, payload)
        .then((res: any) => {
          resolve(res)
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
    })
  }
  function getAirlines(query: string ) {
    return new Promise((resolve, reject) => {
      useEbooking.get('airlines/autocompleteNew', null, { query: query})
        .then((res: any) => {
          airlines.value = res
          resolve(res)
        })
        .catch((error) => {
     //     alert(error)
          reject()
        })
    })
  };

  return { updateServices, processPayment, getBasket, addService, search,  getCancellationPolicies, getAirlines, getResults, getFeatures, getPrebooking, searchToken, results,  features, basketId, preBooking, airlines }

})