import type { Ref } from "nuxt/dist/app/compat/capi";
import type { CarOffice } from "~/interfaces/services/cars/office";
import type { CarsSearchPayload } from "~/interfaces/services/cars/search-payload";
import type { CarFeature, CarService, CarsSearchResponse } from "~/interfaces/services/cars/search-response";

export const useCarsStore = defineStore("cars", () => {
    //state
    const results: Ref<CarService[]> = ref([])
    const features: Ref<CarFeature[]> = ref([])

    const pickupOffices: Ref<CarOffice[]> = ref([])
    const returnOffices: Ref<CarOffice[]> = ref([])
    const isLoadingOffices = ref(false);

    const searchToken = ref('')
    const basketId = ref('')
    const preBooking: Ref<any> = ref({})
    const totalServices = ref(null)


    //getters
    const getResults = computed(() => results.value)
    const getFeatures = computed(() => features.value)
    const getPrebooking = computed(() => preBooking.value)
    const getPickupOffices = computed(() => pickupOffices.value)
    const getReturnOffices = computed(() => returnOffices.value)


    //actions
    function fetchOffices(payload: { cityCode: string, forReturn: boolean }): Promise<any[]> {
        isLoadingOffices.value = true;
        const { cityCode, forReturn } = payload;
        if(forReturn) {
            returnOffices.value = []
        }
        else {
            pickupOffices.value = []
        }
        if(cityCode){
        return new Promise((resolve, reject) => {
            useEbooking.get<CarOffice[]>('smartSearch/allCarOffices', null, { cityCode: cityCode })
                .then((res) => {
                    if (forReturn) {
                        returnOffices.value = res
                    }
                    else {
                        pickupOffices.value = res
                    }
                    resolve(res)
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
                .finally(() => {
                    isLoadingOffices.value = false;
                  });
        })}
    }


    function search(payload: CarsSearchPayload): Promise<CarsSearchResponse[]> {
        return new Promise((resolve, reject) => {
            useEbooking.post('carService/search', null, payload)
                .then((r: any) => {
                    const res = r as CarsSearchResponse;
                    results.value.push(...res.Services)
                    basketId.value = res.Token
                    totalServices.value = res.TotalServices
                    features.value = res.Features
                    resolve(r)
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
        })
    };
    function addService(payload: any) {
        return new Promise((resolve, reject) => {
            useEbooking.get('carService/addServices', null, payload)
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
            useEbooking.get('carService/getBasketServices', null, payload)
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
            useEbooking.post('carService/updateServices', null, payload)
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
            useEbooking.get('carService/getCancelationPolicies', null, payload)
                .then((res: any) => {
                    resolve(res)
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
        })
    }


    return { fetchOffices, updateServices, processPayment, getBasket, addService, search, getCancellationPolicies, getPickupOffices, getReturnOffices, isLoadingOffices, getResults, totalServices, getFeatures, getPrebooking, searchToken, results, features, basketId, preBooking }

})