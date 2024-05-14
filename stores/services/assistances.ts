
import json from '~/assets/ass-countries.json'
export const useAssStore = defineStore("assistances", () => {
    //state
    const results = ref([])
    const features = ref([])
    const searchToken = ref('')
    const basketId = ref('')
    const preBooking = ref({})
    const destinations = ref([])
    const origins = ref(json)
    const isLoadingPlaces = ref(false);
    const totalServices = ref(null)

    //getters
    const getResults = computed(() => results.value)
    const getFeatures = computed(() => features.value)
    const getPrebooking = computed(() => preBooking.value)
    const getOrigins = computed(() => origins.value)
    const getDestinations = computed(() => destinations.value)

    //actions

    function setOrigins(query?: string) {
        origins.value = query ? json.filter(x => x.es.startsWith(query)) : json
    }

    function fetchDestinations() {
        isLoadingPlaces.value = true
        return new Promise((resolve, reject) => {
            useEbooking.get('assistanceService/destinations', null, null)
            .then((res: any) => {
                destinations.value = res
                resolve(res)
            })
            .catch((error) => {
                console.log(error);
                reject()
            })
            .finally(() => {
                isLoadingPlaces.value = false;
            });
        })
    }

    function search(payload) {
        return new Promise((resolve, reject) => {
            useEbooking.post('assistanceService/search', null, payload)
                .then((res: any) => {
                    results.value.push(...res.Services)
                    basketId.value = res.Token
                    features.value = res.Features
                    totalServices.value = res.TotalServices
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
            useEbooking.get('assistanceService/addServices', null, payload)
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
            useEbooking.get('assistanceService/getBasketServices', null, payload)
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
            useEbooking.post('assistanceService/updateServices', null, payload)
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
            useEbooking.get('assistanceService/getCancelationPolicies', null, payload)
                .then((res: any) => {
                    resolve(res)
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
        })
    }

    return { updateServices, processPayment, getBasket, addService, search, getCancellationPolicies, getOrigins, getDestinations, setOrigins, fetchDestinations ,getResults, getFeatures, getPrebooking, searchToken, totalServices, results, features, basketId, preBooking }

})