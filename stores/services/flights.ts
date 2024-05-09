export const useFlightsStore = defineStore("flights", () => {
    //state
    const results = ref([])
    const features = ref([])
    const searchToken = ref('')
    const basketId = ref('')
    const preBooking = ref({})
    const airports = ref([])
    const matrix = ref([])


    //getters
    const getResults = computed(() => results.value)
    const getGrouped = computed(() => {
    const groups = Object.groupBy(results.value, ({ RouteId }) => RouteId)
        return groups
    })

    const getFeatures = computed(() => features.value)
    const getPrebooking = computed(() => preBooking.value)
    const getAirports = computed(() => airports.value)
    const getMatrix = computed(() => matrix.value)

    //actions

    function getAirport(code: string) {
        return new Promise((resolve, reject) => {
            const params = {
                airportId: code
            }

            useEbooking.get('airports/get', null, params)
                .then(res => {
                    if (res) {
                        resolve(res)
                    }
                })
        })
    }

    function fetchAirports(prompt: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const params = {
                query: prompt,
                serviceTypeEnum: 1
            }

            useHistorical.get('smartSearch/autocomplete', null, params)
                .then((res: any) => {
                    if (res) {
                        airports.value = res
                        resolve()
                    }
                    else {
                        reject(res)
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    function search(payload, flex) {
        return new Promise((resolve, reject) => {
            if(flex) {
                useEbooking.post('flightService/searchFlex', null, payload)
                .then((res: any) => {
                    results.value = res.Services
                    basketId.value = res.Token
                    features.value = res.Features
                    matrix.value = res.Matrix
                    resolve(res)
                    // useEbooking.post('flightService/searchNdc', null, payload)
                    //     .then((ndc: any) => {
                    //         results.value.push(...ndc.Services) 
                    //         features.value = ndc.Features
                    //         matrix.value = ndc.Matrix 
                    //         resolve(ndc)
                    //     }) 
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
            } else {
                useEbooking.post('flightService/search', null, payload)
                .then((res: any) => {
                    results.value = res.Services
                    basketId.value = res.Token
                    features.value = res.Features
                    useEbooking.post('flightService/searchNdc', null, payload)
                        .then((ndc: any) => {
                            results.value.push(...ndc.Services) 
                            features.value = ndc.Features
                            resolve(ndc)
                        }) 
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
            }
        })
    };
    function addService(payload: any) {
        return new Promise((resolve, reject) => {
            useEbooking.get('flightService/addServices', null, payload)
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
            useEbooking.get('flightService/getBasketServices', null, payload)
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
            useEbooking.post('flightService/updateServices', null, payload)
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
                    if (res && res.FormData) {
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
            useEbooking.get('flightService/getCancelationPolicies', null, payload)
                .then((res: any) => {
                    resolve(res)
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
        })
    }

    const clearAirports = () => {
        airports.value = []
    }


    return { clearAirports, updateServices, processPayment, getBasket, addService, search, getCancellationPolicies, fetchAirports, getAirport, getAirports, getGrouped, getResults, getFeatures, getMatrix, getPrebooking, searchToken, results, features, basketId, preBooking }

})