import type { Ref } from "nuxt/dist/app/compat/capi";
export const useStaysStore = defineStore("stays", () => {
  const nuxtConfig = useRuntimeConfig()
  const { startConnection, invokeServerMethod, subscribeToEvent, unsubscribeFromEvent } = useSignalR(nuxtConfig.public.ebookingWs, handleDisconnect);
  const accessToken = useCookie('accessToken').value
  const bearer = `Bearer ${accessToken}`
  //state
  const results = ref([])
  const resultsHotelCollect = ref([])
  const features = ref([])
  const searchToken = ref('')
  const connectionIdSignalR = ref(null)
  const isReceiving = ref(false)
  const details = ref([])
  const rooms = ref([])
  const avail = ref([])
  const availHotelCollect = ref([])
  const basketId = ref('')
  const preBooking: Ref<any> = ref({})
  const nearProperties = ref([])
  const guestReviews = ref([])
  //getters
  const getReceiving = computed(() => isReceiving.value)
  const getResults = computed(() => results.value)
  const getResultsHotelCollect = computed(() => resultsHotelCollect.value)
  const getFeatures = computed(() => features.value)
  const getResultsMap = computed(() => resultsMap.value)
  const getFeaturesMap = computed(() => featuresMap.value)
  const getDetails = computed(() => details.value)
  const getAvail = computed(() => avail.value)
  const getAvailHotelCollect = computed(() => availHotelCollect.value)
  const getRooms = computed(() => rooms.value)
  const getNearProperties = computed(() => nearProperties.value)
  const getGuestReviews = computed(() => guestReviews.value)
  const getPrebooking = computed(() => preBooking.value)
  //map
  const resultsMap = ref([])
  const featuresMap = ref([])

  function handleDisconnect() {
    unsubscribeFromEvent('NewResultProperty', null)
    unsubscribeFromEvent('NewAvailProperty', null)
    isReceiving.value = false
  }

  async function handleUnsubscribeResults() {
    unsubscribeFromEvent('NewResultProperty', null)
    unsubscribeFromEvent('Features', null)
    useEbooking5.get('propertyService/stopSearch', null, { connectionId: connectionIdSignalR.value })
    //invokeServerMethod('stopSearch');
  }

  async function handleUnsubscribeAvail() {
    unsubscribeFromEvent('NewAvailProperty', null)
    unsubscribeFromEvent('NewCancellationPolicies', null)
    useEbooking5.get('propertyService/stopSearch', null, { connectionId: connectionIdSignalR.value })
    //invokeServerMethod('stopSearch');
  }

  const headersApi = {
    AgencyId: nuxtConfig.public.agencyId,
    OwnerId: nuxtConfig.public.ownerId,
    WebSiteId: nuxtConfig.public.websiteId
  }

  async function suscribeSearch() {
    results.value = []
    resultsHotelCollect.value = []
    try {
      await startConnection();
      const connectionId = await invokeServerMethod('getConnectionId');
      connectionIdSignalR.value = connectionId;
      isReceiving.value = true

      subscribeToEvent('NewResultProperty', (newItem) => {
        if (!newItem.IsHotelCollect) {
          const existingItemIndex = results.value.findIndex(item => item.Id === newItem.Id);
          if (existingItemIndex !== -1) {
            const existingItem = results.value[existingItemIndex];
            if (newItem.Total != existingItem.Total) {
              existingItem.previousPrice = existingItem.previousPrice || [];
              existingItem.previousPrice.push(existingItem.Total);
              existingItem.Total = newItem.Total;
              results.value[existingItemIndex] = existingItem;
            }
          } else {
            results.value.push(newItem);
          }
        } else {
          const existingItemIndex = resultsHotelCollect.value.findIndex(item => item.Id === newItem.Id);
          if (existingItemIndex !== -1) {
            const existingItem = resultsHotelCollect.value[existingItemIndex];
            if (newItem.Total != existingItem.Total) {
              existingItem.previousPrice = existingItem.previousPrice || [];
              existingItem.previousPrice.push(existingItem.Total);
              existingItem.Total = newItem.Total;
              resultsHotelCollect.value[existingItemIndex] = existingItem;
            }
          } else {
            resultsHotelCollect.value.push(newItem);
          }
        }
      });

      subscribeToEvent('Features', (newItems) => {
        newItems.forEach(newItem => {
          const existingItemIndex = features.value.findIndex(item => item.GroupName === newItem.GroupName);

          if (existingItemIndex !== -1) {
            const existingItem = { ...features.value[existingItemIndex] };

            if (Array.isArray(existingItem.Features) && Array.isArray(newItem.Features)) {
              const uniqueNewFeatures = newItem.Features.filter(newFeature => !existingItem.Features.some(existingFeature => existingFeature.Key === newFeature.Key));

              existingItem.Features = existingItem.Features.concat(uniqueNewFeatures);

              existingItem.Features.sort((a, b) => a.Value.localeCompare(b.Value));
            } else {
              existingItem.Features = newItem.Features;
            }

            features.value[existingItemIndex] = existingItem;
          } else {
            features.value.push(newItem);
          }
        });
      });

    } catch (error) {
      console.error('Error getting connection ID:', error);
    }
  }

  async function fetchResults(payload: Object) {
    payload.ConnectionId = connectionIdSignalR.value;
    payload = { ...payload, ...headersApi };
    payload.securityToken = useCookie("SECURITYTOKEN").value
    payload.authorization = bearer
    //useEbooking5.post('propertyService/search', null, payload)
    invokeServerMethod('PropertySearch', payload);
  };

  async function suscribeAvail() {
    avail.value = []
    rooms.value = []
    try {
      await startConnection();
      const connectionId = await invokeServerMethod('getConnectionId');
      connectionIdSignalR.value = connectionId;
      isReceiving.value = true

      subscribeToEvent('NewAvailProperty', (newItem) => {
        if (avail.value.length < 9000) {
          if (!newItem.IsHotelCollect) {
            const existingItemIndex = avail.value.findIndex(item => item.Id === newItem.Id);
            if (existingItemIndex !== -1) {
              const existingItem = { ...avail.value[existingItemIndex] };
              existingItem.previousPrice.push(existingItem.Total);
              existingItem.Total = newItem.Total;
              avail.value[existingItemIndex] = existingItem;
            } else {
              avail.value.push(newItem);
            }
          } else {
            const existingItemIndex = avail.value.findIndex(item => item.Id === newItem.Id);
            if (existingItemIndex !== -1) {
              const existingItem = { ...availHotelCollect.value[existingItemIndex] };
              existingItem.previousPrice.push(existingItem.Total);
              existingItem.Total = newItem.Total;
              availHotelCollect.value[existingItemIndex] = existingItem;
            } else {
              availHotelCollect.value.push(newItem);
            }
          }
        }
      });

      subscribeToEvent('NewCancellationPolicies', (newItem) => {
        const existingItemIndex = avail.value.findIndex(item => item.Id === newItem.Id);
        if (existingItemIndex !== -1) {
          avail.value[existingItemIndex] = {
            ...avail.value[existingItemIndex],
            CancellationPolicies: newItem.CancellationPolicies,
            LastDayToCharge: newItem.LastDayToCharge,
            NonRefundable: newItem.NonRefundable,
            CancellationPoliciesFetched: true,
            HaveCancellationPolicies: true
          };
        }
      });

      subscribeToEvent('GetOccupancyData', (occupancy) => {
        rooms.value.splice(0, rooms.value.length, ...occupancy)
      });

    } catch (error) {
      console.error('Error getting connection ID:', error);
    }
  }

  async function fetchAvail(payload: Object) {
    payload.ConnectionId = connectionIdSignalR.value;
    payload = { ...payload, ...headersApi };
    payload.securityToken = useCookie("SECURITYTOKEN").value
    payload.authorization = bearer
    invokeServerMethod('PropertyAvail', payload);
    // useEbooking5.post('propertyService/avail', null, payload).then((res: any) => { })

  };

  function fetchDetails(payload: string) {
    return new Promise((resolve, reject) => {
      useEbooking.get(`properties/propertyInfo/${payload}`, null, { language: 'es' })
        .then((res: any) => {
          details.value = res
          resolve(res)
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
    })
  };
  function searchByArea(payload: Object) {
    return new Promise((resolve, reject) => {
      useEbooking.post('propertyService/search', null, payload)
        .then((res: any) => {
          resultsMap.value = res.Services
          featuresMap.value = res.Features
          searchToken.value = res.Token
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
      useEbooking.get('propertyService/addServices', null, payload)
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
      useEbooking.get('propertyService/getBasketServices', null, payload)
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
      useEbooking.post('propertyService/updateServices', null, payload)
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
          console.log(res)
          resolve(res)
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
  function fetchNearProperties(payload: any) {
    return new Promise((resolve, reject) => {
      useEbooking.get('properties/nearProperties', null, payload)
        .then((res: any) => {
          nearProperties.value = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  };
  function fetchGuestReviewsById(payload: any) {
    return new Promise((resolve, reject) => {
      useEbooking.get(`common/expedia/getguestreviews?propertyId=${payload.id}`, null, payload)
        .then((res: any) => {
          guestReviews.value = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  };
  function getCancellationPolicies(payload: object) {
    return new Promise((resolve, reject) => {
      useEbooking.get('propertyService/getCancelationPolicies', null, payload)
        .then((res: any) => {
          resolve(res)
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
    })
  };

  return { updateServices, processPayment, getBookingByTransaction, getBasket, addService, suscribeAvail, fetchAvail, fetchDetails, suscribeSearch, fetchResults, handleDisconnect, handleUnsubscribeResults, handleUnsubscribeAvail, searchByArea, fetchNearProperties, fetchGuestReviewsById, getCancellationPolicies, getResults, getResultsHotelCollect, getResultsMap, getFeatures, getFeaturesMap, getPrebooking, getDetails, getAvail, getAvailHotelCollect, getRooms, searchToken, avail, availHotelCollect, results, resultsHotelCollect, rooms, features, resultsMap, featuresMap, details, basketId, preBooking, getNearProperties, getGuestReviews, connectionIdSignalR, getReceiving }

})