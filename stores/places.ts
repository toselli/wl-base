import top from '@/stores/data/top-places.json'
export const usePlacesStore = defineStore('places', () => {
  const places = ref([]);
  const countries = ref([]);
  const isLoadingPlaces = ref(false);
  const topPlaces = ref(top)

  const getPlaces = computed(() => places.value);
  const getCountries = computed(() => countries.value);
  const getTopPlaces = computed(() => topPlaces.value)

  const fetchPlaces = async (query, serviceType) => {
    isLoadingPlaces.value = true;
    try {
      const res = await useHistorical.get('smartsearch/autocomplete', null, { query, serviceTypeEnum: serviceType });
      places.value = [...res];
    } catch (error) {
      console.error(error);
    } finally {
      isLoadingPlaces.value = false;
    }
  };

  const fetchCountries = () => {
    isLoadingPlaces.value = true; // Suponiendo que quieras usar el mismo indicador de carga
    return new Promise((resolve, reject) => {
      useEbooking.get('countries/all', null, {})
        .then((res) => {
          countries.value = res;
          resolve(res);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        })
        .finally(() => {
          isLoadingPlaces.value = false;
        });
    });
  };

  return { 
    places, 
    countries, 
    isLoadingPlaces, 
    getPlaces, 
    getCountries, 
    getTopPlaces,
    topPlaces,
    fetchPlaces, 
    fetchCountries 
  };
});