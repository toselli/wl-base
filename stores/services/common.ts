export const useCommonServicesStore = defineStore("commonServices", () => {

  function processPayment(payload: any) {
    return new Promise((resolve, reject) => {
      useEbooking.post('payments/paymentRequest', null, payload)
        .then((res: any) => {
          if (res) {
            resolve(res)
          }
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
  function getBookingByTransaction(payload: any) {
    return new Promise((resolve, reject) => {
      useEbooking.get('bookings/getBookingsByTransactionId', null, payload)
        .then((res: any) => {
            resolve(res)
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }

  return { processPayment, getBookingByTransaction }

})