import serviceTypes from '~/assets/service-types.json'
export const useWebStore = defineStore("web", () => {
    const getServiceTypeFromUrl = () => {
        const route = useRoute();
        const pathSegments = route.path.split('/');
        const serviceTypeCode = pathSegments[1] // assuming the type code is after the first slash
        const matchingService = serviceTypes.find(service => service.code === serviceTypeCode)
        return matchingService || null
    }
    //state
    const serviceType = ref(getServiceTypeFromUrl() || serviceTypes[0])
    const toursOnHome = ref([])
    const exchanges = ref([])
    const website = ref({})
    //getters
    const getServiceTypes = computed(() => serviceTypes)
    const getWebsite = computed(() => website)
    const getServiceType = computed(() => getServiceTypeFromUrl() || serviceType)
    const getExchanges = computed(() => exchanges.value)
    const getToursOnHome = computed(() => {
        const groupBy = (array, key) => array.reduce((result, currentValue) => {
          // Aquí asumimos que key es una función que toma un objeto y devuelve la clave por la cual agrupar
          const groupKey = key(currentValue);
      
          // Si no existe aún un array para la clave de grupo, créalo
          if (!result[groupKey]) result[groupKey] = [];
      
          // Añade el objeto actual al grupo correspondiente
          result[groupKey].push(currentValue);
      
          return result;
        }, {});
      
        // Aquí pasamos una función que extrae la propiedad PageRoute del objeto TourType
        return groupBy(toursOnHome.value, tour => tour.TourType.PageRoute);
      });
      
        //actions
    const setServiceType = (value) => {
        serviceType.value = value
        localStorage.setItem("serviceType", JSON.stringify(value))
    }

    const fetchToursOnHome = () => {
        return new Promise((resolve, reject) => {
            useEbooking.get('tours/toursOnHome', null, null)
                .then(res => {
                    toursOnHome.value = res
                    resolve(res)
                })
        })
    }

    const fetchWebsite = () => {
        const nuxtConfig = useRuntimeConfig() 
        return new Promise((resolve, reject) => {
            useEbooking.get('clients/getWebSite',  {
                'AgencyId': nuxtConfig.public.agencyId,
                'OwnerId': nuxtConfig.public.ownerId,
                'WebSiteId': nuxtConfig.public.websiteId
            }, null)
            .then((res) => {
                website.value = res;
                resolve(res)
            })
        })
    }

    const fetchExchanges = () => {
        return new Promise((resolve, reject) => {
            useEbooking.get('currencyExchange/getExchangeCurrency?fromCurrencies=USD&fromCurrencies=EUR&fromCurrencies=BRL&fromCurrencies=GBP&fromCurrencies=BSP', null, null)
                .then(res => {
                    exchanges.value = res
                    resolve(res)
                })
        })
    }

    return { fetchWebsite, fetchToursOnHome,fetchExchanges, getExchanges, getToursOnHome, getServiceTypes, getServiceType, setServiceType, getWebsite, serviceType }

})