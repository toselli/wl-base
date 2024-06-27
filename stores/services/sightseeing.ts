import type { Ref } from "nuxt/dist/app/compat/capi";
import { ListResponse, SightseeingService } from "~/interfaces/services/sightseeing/ListResponse";
import { ListRequest } from "~/interfaces/services/sightseeing/ListRequest";
import { Catalog } from "~/interfaces/services/sightseeing/Catalog";
import { SightseeingAvailRequest } from "~/interfaces/services/sightseeing/AvailRequest";
import { SightseeingAvailResponse } from "~/interfaces/services/sightseeing/AvailResponse";

export const useSightseeingStore = defineStore("sightseeing", () => {
    //state
    const results: Ref<SightseeingService[]> = ref([
        {
            "ProductCode": "1234",
            "Title": "Test",
            "Description": "Description1",
            "Rating": 4.5,
            "Duration": 26,
            "ThumbUrl": "https://images.musement.com/cover/0164/68/thumb_16367239_cover_header.jpg?w=540",
            "CancelationPoliciesDescription": [],
            "NonRefundable": true,
            "TicketType": 0,
            "ProviderRef": "musement",
            "Amount": 1234.9,
            "Currency": "USD",
            "Recommended": false
        },
        {
            "ProductCode": "57645",
            "Title": "Test2",
            "Description": "Description2",
            "Rating": 5.0,
            "Duration": 4,
            "ThumbUrl": "https://images.musement.com/cover/0164/68/thumb_16367239_cover_header.jpg?w=540",
            "CancelationPoliciesDescription": [],
            "NonRefundable": true,
            "TicketType": 0,
            "ProviderRef": "musement",
            "Amount": 1234.9,
            "Currency": "USD",
            "Recommended": false
        },
        {
            "ProductCode": "64234",
            "Title": "Test3",
            "Description": "Description3",
            "Rating": 2.3,
            "Duration": 15,
            "ThumbUrl": "https://images.musement.com/cover/0164/68/thumb_16367239_cover_header.jpg?w=540",
            "CancelationPoliciesDescription": [],
            "NonRefundable": true,
            "TicketType": 0,
            "ProviderRef": "viatorsightseeing",
            "Amount": 1234.9,
            "Currency": "USD",
            "Recommended": false
        },
        {
            "ProductCode": "643712",
            "Title": "Test4",
            "Description": "Description4",
            "Rating": 3.0,
            "Duration": 126,
            "ThumbUrl": "https://images.musement.com/cover/0164/68/thumb_16367239_cover_header.jpg?w=540",
            "CancelationPoliciesDescription": [],
            "NonRefundable": true,
            "TicketType": 0,
            "ProviderRef": "viatorsightseeing",
            "Amount": 1234.9,
            "Currency": "USD",
            "Recommended": false
        },
        {
            "ProductCode": "98674",
            "Title": "Test5",
            "Description": "Description5",
            "Rating": 4.0,
            "Duration": 3,
            "ThumbUrl": "https://images.musement.com/cover/0164/68/thumb_16367239_cover_header.jpg?w=540",
            "CancelationPoliciesDescription": [],
            "NonRefundable": true,
            "TicketType": 0,
            "ProviderRef": "graylinesightseeing",
            "Amount": 1234.9,
            "Currency": "USD",
            "Recommended": false
        }
    ])
    const searchToken = ref('')
    const basketId = ref('')
    const preBooking: Ref<any> = ref({})
    const product: Ref<any> = ref({
        "AdditionalInformation": [
            "Enjoy a 3-hour boat party near Malaga center",
            "Dance under the Mediterranean sun the last hits",
            "Swim into the sea when the boat is ready for"
        ],
        "Occupancies" : [
            {
                "Id" : 1,
                "MaxBuy": 3,
                "MinBuy": 0,
                "Name": "Adulto Mayor (+60)",
                "Quantity": 0
            },
            {
                "Id" : 2,
                "MaxBuy": 0,
                "MinBuy": 0,
                "Name": "Adulto(+18)",
                "Quantity": 0
            },
            {
                "Id" : 3,
                "MaxBuy": 0,
                "MinBuy": 0,
                "Name": "Jóvenes (13-17)",
                "Quantity": 0
            },
            {
                "Id" : 4,
                "MaxBuy": 0,
                "MinBuy": 0,
                "Name": "Niños (2-12)",
                "Quantity": 0
            },
            {
                "Id" : 5,
                "MaxBuy": 0,
                "MinBuy": 0,
                "Name": "Bebes(0-2)",
                "Quantity": 0
            }
        ],
        "Amount": 0.0,
        "Calendar": [
            {
                "Date": "2024-08-01T00:00:00",
                "Tickets": [
                    {
                        "Amount": 450.0,
                        "Code": "1241",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Adulto Mayor (+60)",
                        "Quantity": 0
                    },
                    {
                        "Amount": 450.0,
                        "Code": "5133",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Adulto(+18)",
                        "Quantity": 0
                    },
                    {
                        "Amount": 250.0,
                        "Code": "3523",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Infantes",
                        "Quantity": 0
                    },
                    {
                        "Amount": 20.0,
                        "Code": "5475",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Bebes(0-2)",
                        "Quantity": 0
                    }
                ],
                "Times": [
                    {
                        "Available": true,
                        "Time": "13:00"
                    },
                    {
                        "Available": true,
                        "Time": "15:00"
                    },
                    {
                        "Available": true,
                        "Time": "18:00"
                    },
                    {
                        "Available": false,
                        "Time": "20:00"
                    },
                    {
                        "Available": true,
                        "Time": "22:00"
                    }
                ]
            },
            {
                "Date": "2024-08-02T00:00:00",
                "Tickets": [
                    {
                        "Amount": 450.0,
                        "Code": "1241",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Adulto Mayor (+60)",
                        "Quantity": 0
                    },
                    {
                        "Amount": 450.0,
                        "Code": "5133",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Adulto(+18)",
                        "Quantity": 0
                    },
                    {
                        "Amount": 250.0,
                        "Code": "3523",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Infantes",
                        "Quantity": 0
                    },
                    {
                        "Amount": 20.0,
                        "Code": "5475",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Bebes(0-2)",
                        "Quantity": 0
                    }
                ],
                "Times": [
                    {
                        "Available": true,
                        "Time": "13:00"
                    },
                    {
                        "Available": true,
                        "Time": "15:00"
                    },
                    {
                        "Available": true,
                        "Time": "18:00"
                    },
                    {
                        "Available": false,
                        "Time": "20:00"
                    },
                    {
                        "Available": true,
                        "Time": "22:00"
                    }
                ]
            },
            {
                "Date": "2024-08-03T00:00:00",
                "Tickets": [
                    {
                        "Amount": 450.0,
                        "Code": "1241",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Adulto Mayor (+60)",
                        "Quantity": 0
                    },
                    {
                        "Amount": 450.0,
                        "Code": "5133",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Adulto(+18)",
                        "Quantity": 0
                    },
                    {
                        "Amount": 250.0,
                        "Code": "3523",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Infantes",
                        "Quantity": 0
                    },
                    {
                        "Amount": 20.0,
                        "Code": "5475",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Bebes(0-2)",
                        "Quantity": 0
                    }
                ],
                "Times": [
                    {
                        "Available": true,
                        "Time": "13:00"
                    },
                    {
                        "Available": true,
                        "Time": "15:00"
                    },
                    {
                        "Available": true,
                        "Time": "18:00"
                    },
                    {
                        "Available": false,
                        "Time": "20:00"
                    },
                    {
                        "Available": true,
                        "Time": "22:00"
                    }
                ]
            },
            {
                "Date": "2024-08-04T00:00:00",
                "Tickets": [
                    {
                        "Amount": 450.0,
                        "Code": "1241",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Adulto Mayor (+60)",
                        "Quantity": 0
                    },
                    {
                        "Amount": 450.0,
                        "Code": "5133",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Adulto(+18)",
                        "Quantity": 0
                    },
                    {
                        "Amount": 250.0,
                        "Code": "3523",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Infantes",
                        "Quantity": 0
                    },
                    {
                        "Amount": 20.0,
                        "Code": "5475",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Bebes(0-2)",
                        "Quantity": 0
                    }
                ],
                "Times": [
                    {
                        "Available": true,
                        "Time": "13:00"
                    },
                    {
                        "Available": true,
                        "Time": "15:00"
                    },
                    {
                        "Available": true,
                        "Time": "18:00"
                    },
                    {
                        "Available": false,
                        "Time": "20:00"
                    },
                    {
                        "Available": true,
                        "Time": "22:00"
                    }
                ]
            },
            {
                "Date": "2024-08-05T00:00:00",
                "Tickets": [
                    {
                        "Amount": 450.0,
                        "Code": "1241",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Adulto Mayor (+60)",
                        "Quantity": 0
                    },
                    {
                        "Amount": 450.0,
                        "Code": "5133",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Adulto(+18)",
                        "Quantity": 0
                    },
                    {
                        "Amount": 250.0,
                        "Code": "3523",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Infantes",
                        "Quantity": 0
                    },
                    {
                        "Amount": 20.0,
                        "Code": "5475",
                        "Currency": "USD",
                        "MaxBuy": 0,
                        "MinBuy": 0,
                        "Name": "Bebes(0-2)",
                        "Quantity": 0
                    }
                ],
                "Times": [
                    {
                        "Available": true,
                        "Time": "13:00"
                    },
                    {
                        "Available": true,
                        "Time": "15:00"
                    },
                    {
                        "Available": true,
                        "Time": "18:00"
                    },
                    {
                        "Available": false,
                        "Time": "20:00"
                    },
                    {
                        "Available": true,
                        "Time": "22:00"
                    }
                ]
            }
        ],
        "CancelationPoliciesDescription": [
        ],
        "Description": "Enjoy a boat party near Malaga. Dance, relax, and have a great time with your friends!",
        "Duration": "5",
        "Exclusion": [
            "Comidas y bebidas adicionales"
        ],
        "Images": [
            {
                "Caption": "photo",
                "IsHiRes": true,
                "Url": "https://images.musement.com/cover/0164/68/thumb_16367239_cover_header.jpg?w=540"
            },
            {
                "Caption": "photo2",
                "IsHiRes": true,
                "Url": "https://images.musement.com/cover/0164/68/thumb_16367239_cover_header.jpg?w=540"
            }
        ],
        "Inclusion": [
            "Entradas",
            "Bebida de bienvenida"
        ],
        "NonRefundable": false,
        "Rating": 4.5,
        "Recommended": false,
        "TicketType": 0,
        "Title": "Boat party in Malaga",
        "VoucherRequirements": "MOBILE"
    })
    const avail: Ref<SightseeingAvailResponse[]> = ref([])
    const totalServices = ref(null)
    const features: Ref<any[]> = ref([])


    //getters
    const getResults = computed(() => results.value)
    const getFeatures = computed(() => features.value)
    const getPrebooking = computed(() => preBooking.value)
    const getProduct = computed(() => product.value)

    const getAvail: ComputedRef<SightseeingAvailResponse[]> = computed(() => avail.value)



    //actions
    function search(payload: ListRequest): Promise<any[]> {
        return new Promise((resolve, reject) => {
            useEbooking.post('circuitService/searchCatalogs', null, payload)
                .then((res: any) => {
                    results.value.push(...res.Services)
                    basketId.value = res.Token
                    totalServices.value= res.TotalServices
                    resolve(res)
                })
                .catch((error) => {
                    console.log(error)
                    reject()
                })
        })
    };
    function fetchDetails(payload: { catalogId: string, currency: string }) {
        return new Promise((resolve, reject) => {
            useEbooking.get('circuitService/getCatalogDetails', null, payload)
                .then((res: any) => {
                    resolve(res)
                    product.value = res
                })
                .catch((error) => {
                    console.log(error)
                    reject(error)
                })
        })
    };

    function getAvailability(payload: SightseeingAvailRequest) {
        return new Promise((resolve, reject) => {
            useEbooking.post('circuitService/getAvailability', null, payload)
                .then((res: any) => {
                    const r = res as SightseeingAvailResponse[]
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
    function clearSearch() {
        results.value = []
    }


    return {
        fetchDetails,  clearSearch,  getAvailability, updateServices, processPayment, getBasket, addService, search, getCancellationPolicies,
        getResults, getAvail, getFeatures, getProduct, getPrebooking, totalServices, searchToken, results, features, basketId, preBooking, product
    }

})