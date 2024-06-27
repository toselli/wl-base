import type { Ref } from "nuxt/dist/app/compat/capi";
import { ListResponse, CircuitService } from "~/interfaces/services/circuits/ListResponse";
import { ListRequest } from "~/interfaces/services/circuits/ListRequest";
import { Catalog } from "~/interfaces/services/circuits/Catalog";
import { CircuitAvailRequest } from "~/interfaces/services/circuits/AvailRequest";
import { CircuitAvailResponse } from "~/interfaces/services/circuits/AvailResponse";

export const useCircuitsStore = defineStore("circuits", () => {
    //state
    const cities: Ref<any[]> = ref([])
    const countries: Ref<any[]> = ref([])
    const results: Ref<CircuitService[]> = ref([])
    const features: Ref<any[]> = ref([])
    const searchToken = ref('')
    const basketId = ref('')
    const preBooking: Ref<any> = ref({})
    const catalog: Ref<Catalog> = ref({})
    const avail: Ref<CircuitAvailResponse[]> = ref([])
    const totalServices = ref(null)


    //getters
    const getCities = computed(() => cities.value)
    const getCountries = computed(() => countries.value)
    const getResults = computed(() => results.value)
    const getFeatures = computed(() => features.value)
    const getPrebooking = computed(() => preBooking.value)
    const getCatalog: ComputedRef<Catalog> = computed(() => catalog.value)
    const getAvail: ComputedRef<CircuitAvailResponse[]> = computed(() => avail.value)



    //actions
    function citiesAutocomplete(query: string) {
        return new Promise((resolve, reject) => {
            useEbooking.get('cities/autocompleteForCircuits', null, { query: query })
                .then((res: any) => {
                    ;
                    cities.value = res
                    resolve(res)
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
        })
    };
    function countriesAutocomplete(query: string) {
        return new Promise((resolve, reject) => {
            useEbooking.get('countries/autocomplete', null, { query: query })
                .then((res: any) => {
                    ;
                    countries.value = res
                    resolve(res)
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
        })
    };
    function fetchCountryData(id: string) {
        return new Promise((resolve, reject) => {
            useEbooking.get('countries/getReducedResult', null, { id: id })
                .then((res) => {
                    if (res) {
                        return resolve(res)
                    }
                    else {
                        reject(res)
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    };
    function fetchCityData(id: string) {
        return new Promise((resolve, reject) => {
            useEbooking.get('cities/getSmartSearchDataCity', null, { id: id })
                .then((res) => {
                    if (res) {
                        return resolve(res)
                    }
                    else {
                        reject(res)
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    };
    function search(payload: ListRequest): Promise<any[]> {
        return new Promise((resolve, reject) => {
            useEbooking.post('circuitService/searchCatalogs', null, payload)
                .then((res: any) => {
                    results.value.push(...res.Services)
                    basketId.value = res.Token
                    features.value = res.Features
                    totalServices.value= res.TotalServices
                    resolve(res)
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
        })
    };
    function fetchCatalog(payload: { catalogId: string, currency: string }) {
        return new Promise((resolve, reject) => {
            useEbooking.get('circuitService/getCatalogDetails', null, payload)
                .then((res: any) => {
                    resolve(res)
                    catalog.value = res
                })
                .catch((error) => {
                    console.log(error)
                    reject(error)
                })
        })
    };

    function getAvailability(payload: CircuitAvailRequest) {
        return new Promise((resolve, reject) => {
            useEbooking.post('circuitService/getAvailability', null, payload)
                .then((res: any) => {
                    const r = res as CircuitAvailResponse[]
                    avail.value = r;
                    basketId.value = r[0].BasketId
                    resolve(res)
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
        })
    }

    function addService(payload: any) {
        return new Promise((resolve, reject) => {
            useEbooking.post('circuitService/addServices', null, payload)
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
          
            useEbooking.get('circuitService/getBasketServices', null, payload)
                .then((res: any) => {
                    preBooking.value = res
                    resolve(res)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    };
    function setStartEnd(payload: any) {
        return new Promise((resolve, reject) => {
            const {basketId, beginIndexDay,  beginIndexCity,  endIndexDay,  endIndexCity} = payload;
            useEbooking.get('circuitService/setBeginEndCities',null, payload)
            .then((res) => {
                if(res && res.StatusCode == 200) {
                    resolve(res)
                }
                else {
                    reject(res)
                }
            })
            .catch(err => {
                reject(err)
            })
        })
    };
    //circuitService/setExtraNights?basketId=65ccf07b270fd03d8a4ae7ab&extraPreNights=1&extraPostNights=1
    function setExtraNights(payload: any) {
        return new Promise((resolve, reject) => {
            useEbooking.get('circuitService/setExtraNights',null, payload)
            .then((res) => {
                if(res && res.StatusCode == 200) {
                    resolve(res)
                }
                else {
                    reject(res)
                }
            })
            .catch(err => {
                reject(err)
            })
        })
    };
    function setTransfers(payload: any) {
        return new Promise((resolve, reject) => {
            useEbooking.get('circuitService/setTransferDetails',null, payload)
            .then((res) => {
                if(res && res.StatusCode == 200) {
                    resolve(res)
                }
                else {
                    reject(res)
                }
            })
            .catch(err => {
                reject(err)
            })
        })
    };
    function updateServices(payload: any) {
        return new Promise((resolve, reject) => {
            useEbooking.post('circuitService/updateServices', null, payload)
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
    };
    function getCancellationPolicies(payload: object) {
        return new Promise((resolve, reject) => {
            useEbooking.get('circuitService/getCancelationPolicies', null, payload)
                .then((res: any) => {
                    resolve(res)
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
        })
    };
    function clearCities() {
        cities.value = []
    }
    function clearCountries() {
        countries.value = []
    }
    function clearSearch() {
        results.value = []
    }


    return {
        fetchCatalog, fetchCityData, fetchCountryData, clearCities, clearSearch, setStartEnd, setExtraNights, setTransfers, clearCountries, countriesAutocomplete, getAvailability, citiesAutocomplete, updateServices, processPayment, getBasket, addService, search, getCancellationPolicies,
        getCatalog, getCountries, getCities, getResults, getAvail, getFeatures, getPrebooking, totalServices, searchToken, results, features, basketId, preBooking
    }

})