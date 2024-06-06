<template>
  <v-card class="mb-3" rounded="xl" :loading="loading" :class="isFullscreen ? 'map-fullscreen' : ''">

    <client-only>
      <l-map :zoom="zoomLevel" style="width: 100%; height: 100vh"  :center="center" :use-global-leaflet="false" id="map"
        :options="{ zoomControl: false }" @update:zoom="updateZoom" @ready="$emit('ready'); updateCenter()"
        @update:bounds="checkMarkersInBounds">
        <l-control-zoom position="topright"></l-control-zoom>
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <template v-if="leafletReady">
          <l-marker v-for="(cluster, index) in clusteredMarkers" :key="index" :lat-lng="cluster.center"
            :icon="cluster.markers.length === 1 ? noIcon : noIcon">
            <l-tooltip :options="tooltipOptionsMarker" v-if="tooltipVisibility && cluster.markers.length === 1"
              class="text-right">
              <div>
                {{ cluster.markers[0].Name.substring(0, 15) }}... - <strong>${{ cluster.markers[0].Total.toFixed(2)
                  }}</strong>
              </div>
            </l-tooltip>
            <l-tooltip :options="tooltipOptions" v-if="tooltipVisibility && cluster.markers.length > 1"
              class="text-right" :class="setLabelColor(cluster.markers.length)">
              <span>{{ cluster.markers.length }} opciones</span>
            </l-tooltip>
            <l-popup :options="popupOptions" v-if="cluster.markers.length === 1">
              <stays-list-result-card :item="cluster.markers[0]" :mode="'grid'" v-if="cluster.markers.length === 1"
                  @goTo="$emit('goTo', cluster.markers[0])"
                  @goTotab="$emit('goTotab', cluster.markers[0])"></stays-list-result-card>
            </l-popup>
          </l-marker>

          <l-marker v-for="item in filteredPoi" :key="item.name" :lat-lng="item.marker" :icon="item.icon">
            <l-tooltip :options="tooltipPoiOptions">
              <h4>{{ item.name }}</h4>
              <p class="body-2" v-html="item.description"></p>
            </l-tooltip>
          </l-marker>
          <div class="floating-poi" v-if="!loadingArea && !isMobile">
            <v-btn v-for="poiType in poiTypes" :key="poiType" icon density="compact"
              :class="{ 'active-poi': showPoiLayer[poiType] }" class="my-1" @click="togglePoiLayer(poiType)">
              <v-img :src="'/base/img/icons/' + poiType + '.png'" width="15"></v-img>
            </v-btn>
          </div>
          <div class="floating-results"  v-if="!isMobile">
          <v-card class="bg-transparent pa-2" variant="flat">
            <div v-for="cluster in clusteredMarkers">
              <div v-for="result in cluster.markers">
                <stays-list-result-card :item="result" :mode="'grid'" v-if="cluster.markers.length === 1"
                  @goTo="$emit('goTo', cluster.markers[0])" class="mb-1" :hideInfo="true"
                  @goTotab="$emit('goTotab', cluster.markers[0])"></stays-list-result-card>
              </div>
            </div>
          </v-card>
          </div>       
          <div :class="docked ? 'floating-search-docked' : 'floating-search'" v-if="!loadingArea">
            <v-text-field variant="solo" rounded="lg" hide-details density="compact" label="Filtrar por nombre"
              v-model="searchPromptModel" class="pt-0 mr-2" clearable
              :placeholder="`Escriba nombre del hotel y presione la tecla Enter`" v-if="!docked"></v-text-field>
          </div>
          <div class="floating-tools">
            <v-btn icon density="compact" class="ml-1" @click="hideTooltip()">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon density="compact" @click="docked = false; $emit('expand')" class="ml-1"
              v-if="docked && !isFullscreen">
              <v-icon>mdi-dock-bottom</v-icon>
            </v-btn>
            <v-btn icon density="compact" @click="docked = true; $emit('expand')" class="ml-1"
              v-else-if="!isFullscreen">
              <v-icon>mdi-dock-right</v-icon>
            </v-btn>
            <v-btn icon density="compact" class="ml-1" @click="fullscreenMap()" v-if="!isFullscreen">
              <v-icon>mdi-fullscreen</v-icon>
            </v-btn>
            <v-btn icon density="compact" class="ml-1" @click="exitFullscreenMap()" v-else>
              <v-icon>mdi-fullscreen-exit</v-icon>
            </v-btn>
            <v-btn icon density="compact" class="ml-1" @click="changeTile()">
              <v-icon>md:map</v-icon>
            </v-btn>
            <v-btn icon density="compact" class="ml-1" color="secondary" @click="hideMap()">
              <v-icon>md:close</v-icon>
            </v-btn>
          </div>
          <div class="floating-bottom"  v-if="!isMobile">
            <v-btn variant="flat" rounded="lg" class="ml-1" color="secondary" v-if="zoomLevel > 14"
              :loading="loadingArea" @click="searchByArea()">
              <v-icon>md:search</v-icon> Buscar en el área
            </v-btn>
          </div>
          <div class="floating-filters" v-if="resultsToShow == 'initial'">
            <stays-filters :filters="features" v-if="filters && isFullscreen" :compact="true" @apply="handleFilters" />
          </div>
        </template>
      </l-map>
    </client-only>
  </v-card>
</template>

<script setup>
const isMobile = useMobile()
const props = defineProps(["filters", "results"])
const emit = defineEmits(['update:prompt', 'update:filters', 'ready', 'goTo', 'goTo', 'expand', 'hideMap', 'searchArea'])
const zoomLevel = ref(11)
const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
const loading = ref(false)

const icon = ref(null)
const noIcon = ref(null)
const iconClusterBlue = ref(null)
const iconClusterYellow = ref(null)
const iconClusterRed = ref(null)
const center = ref([])

function changeTile() {
  const option1 = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const option2 = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  url.value = url.value === option1 ? option2 : option1;
}

const resultsToShow = ref('initial');

const tooltipVisibility = ref(true)

function hideTooltip() {
  tooltipVisibility.value = !tooltipVisibility.value
}

const tooltipOptionsMarker = {
  permanent: true,
  interactive: true,
  className: 'label-marker'
};

const tooltipOptions = {
  permanent: true,
  interactive: true,
  className: 'label-cluster'
};

const popupOptions = {
  minWidth: 360,
};

const searchPromptModel = ref('')

watch(searchPromptModel, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (resultsToShow.value === 'initial') {
      emitPrompt(newValue);
    } else {
      filterByName(newValue);
    }
  }
});

const filtersArea = ref([])

const handleFilters = (filters) => {
  if (resultsToShow.value === 'initial') {
    emitFilters(filters);
  } else {
    filtersArea.value = filters
    nextTick().then(() => {
      setTimeout(() => {
        checkMarkersInBounds(mapBounds.value)
      }, 200);
    });
  }
}

const emitPrompt = (value) => {
  emit('update:prompt', value);
  checkMarkersInBounds(mapBounds.value)
};

const emitFilters = (value) => {
  emit('update:filters', value);
  nextTick().then(() => {
    setTimeout(() => {
      checkMarkersInBounds(mapBounds.value)
    }, 200);
  });
};

const hotelNameArea = ref('')

function filterByName(payload) {
  hotelNameArea.value = payload
  nextTick().then(() => {
    setTimeout(() => {
      checkMarkersInBounds(mapBounds.value)
    }, 200);
  });
}


const filteredResultsArea = computed(() => {
  const activeFilters = filtersArea.value
    .flat()
    .map(filter => ({
      GroupName: filter.GroupName,
      SelectedFeatures: filter.Filters.map(f => f.Key) ?? [],
    }));

  return resultsArea.value.filter(hotel => {
    const plainNameMatch = hotel.PlainName.toLowerCase().includes(hotelNameArea.value.toLowerCase());

    if (activeFilters.length > 0) {
      const featuresMatch = activeFilters.every(activeFilter => {
        if (activeFilter.GroupName === 'feature.propertyCategory') {
          const hotelCategory = hotel.Category.toFixed(2);
          return hotelCategory && activeFilter.SelectedFeatures.includes(hotelCategory);
        } else {
          return hotel.Features && Array.isArray(hotel.Features) && activeFilter.SelectedFeatures.every(feature => {
            return hotel.Features.includes(feature);
          });
        }
      });

      return plainNameMatch && featuresMatch;
    }
    return plainNameMatch;
  });
});



//LEAFLET
const mapInstance = ref(null);
const L = ref(null);
const leafletReady = ref(false)
const poiIcons = ref({})

function loadLeaflet() {
  let firstItem = props.results[0];
  center.value = [firstItem.Latitude, firstItem.Longitude + 0.445]
  return new Promise((resolve, reject) => {
    if (process.client) {
      import('leaflet')
        .then((leaflet) => {
          L.value = leaflet.default;
          mapInstance.value = L.value
          icon.value = new L.value.Icon({
            iconUrl: '/base/img/icons/near_hotels.png',
            iconSize: [30, 30],
            iconAnchor: [15, 12],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          noIcon.value = new L.value.Icon({
            iconUrl: '/base/img/icons/no_icon.png',
            iconSize: [30, 30],
            iconAnchor: [15, 12],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          iconClusterBlue.value = new L.value.Icon({
            iconUrl: '/base/img/icons/blue-map-cluster-icon.png',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          iconClusterYellow.value = new L.value.Icon({
            iconUrl: '/base/img/icons/darken-map-cluster-icon.png',
            iconSize: [35, 35],
            iconAnchor: [18, 18],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          iconClusterRed.value = new L.value.Icon({
            iconUrl: '/base/img/icons/darker-map-cluster-icon.png',
            iconSize: [45, 45],
            iconAnchor: [22, 22],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          poiIcons.value = {
            museum: new L.value.Icon({
              iconUrl: '/base/img/icons/museum.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            theatre: new L.value.Icon({
              iconUrl: '/base/img/icons/theatre.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            attraction: new L.value.Icon({
              iconUrl: '/base/img/icons/attraction.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            restaurant: new L.value.Icon({
              iconUrl: '/base/img/icons/restaurant.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            sports_centre: new L.value.Icon({
              iconUrl: '/base/img/icons/sports_centre.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            viewpoint: new L.value.Icon({
              iconUrl: '/base/img/icons/viewpoint.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            nightclub: new L.value.Icon({
              iconUrl: '/base/img/icons/nightclub.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            park: new L.value.Icon({
              iconUrl: '/base/img/icons/park.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            aerodrome: new L.value.Icon({
              iconUrl: '/base/img/icons/aerodrome.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            // Agrega más tipos y sus iconos aquí
          };
          loadPOI()
          resolve();
          leafletReady.value = true
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => {
          fullscreenMap()
        })
    } else {
      reject(new Error('Leaflet solo puede cargarse en el contexto del navegador.'));
    }
  });
}

function updateCenter() {
  let firstItem = props.results[0];
  center.value = [firstItem.Latitude, firstItem.Longitude]
}

onMounted(() => {
  loadLeaflet()
});


//CLUSTERS

const updateZoom = (newZoom) => {
  zoomLevel.value = newZoom;
};

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la tierra en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getThresholdForZoom(zoom) {
  if (zoom < 5) {
    return 20; // Agrupación muy amplia para zooms lejanos.
  } else if (zoom < 10) {
    return 15; // Agrupación media para un nivel de detalle moderado.
  } else if (zoom < 12) {
    // Entre 10 y 11, el umbral disminuye gradualmente desde 10 a 5.4 km.
    return 10 - ((zoom - 10) * 2.7);
  } else if (zoom < 15) {
    // Entre 12 y 14, el umbral disminuye más gradualmente desde 5.4 a 0.5 km.
    // Ajuste para que el umbral disminuya de manera más precisa entre estos niveles.
    return 5.4 - ((zoom - 12) * 1.633);
  } else if (zoom < 16) {
    // En el nivel 15, el umbral es pequeño para preparar la transición a no agrupar.
    return 0.5;
  } else {
    // En el nivel 16 y superior, no se realiza agrupación.
    return 0;
  }
}

const zoomLevelDetailed = 16;

function clusterMarkers(markers, zoom) {
  if (zoom >= zoomLevelDetailed) {
    return markers.map(marker => ({
      center: [marker.Latitude, marker.Longitude],
      markers: [marker]
    }));
  }
  const threshold = getThresholdForZoom(zoom);
  const clusters = [];
  markers.forEach((marker) => {
    let isClustered = false;
    for (const cluster of clusters) {
      const distance = getDistance(cluster.center[0], cluster.center[1], marker.Latitude, marker.Longitude);
      if (distance <= threshold) {
        cluster.markers.push(marker);
        isClustered = true;
        break;
      }
    }
    if (!isClustered) {
      clusters.push({
        center: [marker.Latitude, marker.Longitude],
        markers: [marker]
      });
    }
  });

  clusters.forEach(cluster => {
    if (cluster.markers.length > 1) {
      let avgLat = 0, avgLng = 0;
      cluster.markers.forEach(marker => {
        avgLat += marker.Latitude;
        avgLng += marker.Longitude;
      });
      avgLat /= cluster.markers.length;
      avgLng /= cluster.markers.length;
      cluster.center = [avgLat, avgLng];
    }
  });

  return clusters;
}


function setLabelColor(length) {
  switch (true) {
    case length > 20:
      return 'label-cluster-level-3';
    case length > 8:
      return 'label-cluster-level-2';
    case length > 1:
      return 'label-cluster-level-1';
    default:
      return ''; // Valor predeterminado para cualquier otro caso
  }
}


const clusteredMarkers = ref([]);
const mapBounds = ref({})
const resultsArea = ref([])
const features = ref(props.filters)

watch(props.results, (newInitialResults) => {
  if (newInitialResults.length > 0 && resultsToShow.value !== 'area') {
    resultsToShow.value = 'initial';
    checkMarkersInBounds(mapBounds.value); // Revisar marcadores con los nuevos resultados iniciales
  }
}, { immediate: true });

watch(resultsArea, (newAreaResults) => {
  if (newAreaResults.length > 0) {
    resultsToShow.value = 'area';
    checkMarkersInBounds(mapBounds.value); // Revisar marcadores con los nuevos resultados
  }
}, { immediate: true });

const distanceToTop = ref(null)
const distanceToRight = ref(null)
const searchRadius = ref(null)
const centerLat = ref(null)
const centerLng = ref(null)

function checkMarkersInBounds(bounds) {
  mapBounds.value = bounds
  let activeResults = resultsToShow.value == 'area' ? filteredResultsArea.value : props.results;
  const markersToShow = activeResults.filter(marker => {
    return marker.Latitude >= bounds._southWest.lat &&
      marker.Latitude <= bounds._northEast.lat &&
      marker.Longitude >= bounds._southWest.lng &&
      marker.Longitude <= bounds._northEast.lng;
  });
  clusteredMarkers.value = clusterMarkers(markersToShow, zoomLevel.value);

  centerLat.value = (bounds._southWest.lat + bounds._northEast.lat) / 2;
  centerLng.value = (bounds._southWest.lng + bounds._northEast.lng) / 2;


  const topLat = bounds._northEast.lat;
  const rightLng = bounds._northEast.lng;

  distanceToTop.value = getDistance(centerLat.value, centerLng.value, topLat, centerLng.value);
  distanceToRight.value = getDistance(centerLat.value, centerLng.value, centerLat.value, rightLng);
  searchRadius.value = Math.max(distanceToTop.value, distanceToRight.value) * 1000;
}

//SEARCH

function searchByArea() {

  let searchMap = {
    Latitude: centerLat.value,
    Longitude: centerLng.value,
    Distance: searchRadius.value.toFixed(0)
  }

  getResultsByArea(searchMap)
}

const route = useRoute();
const store = useStaysStore();
const loadingArea = ref(false)


async function getResultsByArea(searchMap) {
  loadingArea.value = true;
  let sortingBy = {
    Direction: "asc",
    PropertyName: "Total",
  }
  let search = {
    CheckIn: route.query.checkIn,
    CheckOut: route.query.checkOut,
    Currency: "USD",
    House: false,
    Language: "es",
    Occupancies: useOccupancies.parse(route.query.occupancies),
    Nationality: "AR",
    Residence: "AR",
    Longitude: searchMap.Longitude,
    Latitude: searchMap.Latitude,
    Distance: searchMap.Distance
  }
  let paging = {
    Page: 1,
    PageSize: 250
  }
  let payload = {
    Search: search,
    Sorting: sortingBy,
    Paging: paging
  }
  try {
    await store.searchByArea(payload);
    resultsArea.value = store.getResultsMap
    features.value = store.getFeaturesMap
  } catch (error) {
    console.log(error);
  } finally {
    loadingArea.value = false
  }
}

//POI


const tooltipPoiOptions = {
  permanent: false,
  direction: 'top',
};

const poi = ref([])

async function loadPOI() {
  try {
    const query = `
      [out:json];
      (
        node["tourism"="museum"]["name"!=""](around:50000,${center.value[0]},${center.value[1]});
        node["tourism"="attraction"]["name"!=""]["name"](around:50000,${center.value[0]},${center.value[1]});
        node["amenity"="restaurant"]["name"!=""]["cuisine"](around:50000,${center.value[0]},${center.value[1]});
        node["amenity"="nightclub"]["name"!=""](around:50000,${center.value[0]},${center.value[1]});
        node["amenity"="theatre"]["name"!=""](around:50000,${center.value[0]},${center.value[1]});
        node["leisure"="sports_centre"]["name"!=""](around:50000,${center.value[0]},${center.value[1]});
        node["leisure"="park"]["name"!=""](around:50000,${center.value[0]},${center.value[1]});
        node["tourism"="viewpoint"]["name"!=""](around:50000,${center.value[0]},${center.value[1]});
        node["aeroway"="aerodrome"](around:80000,${center.value[0]},${center.value[1]});
      );
      out;
    `;

    const overpassAPI = 'https://overpass-api.de/api/interpreter';

    const response = await fetch(overpassAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: query,
    });

    const poiData = await response.json();

    const poiMarkers = poiData.elements.map((poi) => ({
      marker: [poi.lat, poi.lon],
      name: poi.tags.name,
      type: poi.tags.tourism || poi.tags.amenity || poi.tags.leisure,
      icon: poiIcons.value[poi.tags.tourism || poi.tags.amenity || poi.tags.leisure],
      description: createDescription(poi.tags)
    }));

    poi.value = poiMarkers;

  } catch (error) {
    console.error('Error fetching POIs:', error);
  }
}

function createDescription(tags) {
  const cuisine = tags.cuisine ? ` ${tags.cuisine}</br>` : '';
  const website = tags.website ? `<a href="${tags.website}">${tags.website}</a>` : '';
  return `${cuisine}${website}`;

}

const filteredPoi = computed(() => {
  const selectedPoiTypes = Object.keys(showPoiLayer.value).filter(poiType => showPoiLayer.value[poiType]);
  if (poi.value.length > 0) {
    return poi.value.filter(item => selectedPoiTypes.includes(item.type));
  }
  return [];
});

const poiTypes = computed(() => {
  const typesSet = new Set(poi.value.flatMap(item => {
    if (item.type) {
      return item.type.split('|').filter(type => type);
    }
    return [];
  }));

  // Excluir "hostel" y "attraction"
  const filteredTypes = Array.from(typesSet).filter(type =>
    type !== "hostel" && type !== "yes" && type !== "leisure_centre" && type !== "dojo" && type !== "theme_park" && type !== "camp_site" && type !== "picnic_site" && type !== "fast_food"
  );
  return filteredTypes;
});

const showPoiLayer = ref({});

function togglePoiLayer(poiType) {
  showPoiLayer.value = { ...showPoiLayer.value, [poiType]: !showPoiLayer.value[poiType] };
}
const docked = ref(false)

const isFullscreen = ref(false)

let originalParent;
let nextSibling;

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && isFullscreen.value) {
    restoreElementPosition('map');
    isFullscreen.value = false; // Actualiza el estado a no pantalla completa
  }
});

function restoreElementPosition(elementId) {
  const element = document.getElementById(elementId);
  if (nextSibling) {
    originalParent.insertBefore(element, nextSibling);
  } else {
    originalParent.appendChild(element);
  }
}

function fullscreenMap() {
  const mapElement = document.getElementById('map');
  originalParent = mapElement.parentNode;
  nextSibling = mapElement.nextSibling;

  document.body.appendChild(mapElement);

  if (mapElement.requestFullscreen) {
    mapElement.requestFullscreen();
  } else if (mapElement.mozRequestFullScreen) {
    mapElement.mozRequestFullScreen();
  } else if (mapElement.webkitRequestFullscreen) {
    mapElement.webkitRequestFullscreen();
  } else if (mapElement.msRequestFullscreen) {
    mapElement.msRequestFullscreen();
  }
  isFullscreen.value = true;
}

function exitFullscreenMap() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function hideMap() {
  emit('hideMap')
  exitFullscreenMap()
  resultsToShow.value = 'initial'
}


watch(isFullscreen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

</script>

<style>

.floating-search {
  pointer-events:fill !important;
}

.floating-search:hover {
  pointer-events:none !important;
}

.label-marker {
  font-weight: 600 !important;
  border-radius: 12px !important;
  padding: 6px 12px !important;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
}

.leaflet-tooltip-left.label-marker::before {
  border-left-color: rgba(var(--v-theme-secondary), .8);
  margin-right: -13px;
}

.leaflet-tooltip-right.label-marker::before {
  border-right-color: rgba(var(--v-theme-secondary), .8);
  margin-left: -13px;
}

.label-cluster {
  border-radius: 18px !important;
  padding: 0 !important;
  border: none !important
}

.label-cluster::before {
  display: none
}

.label-cluster-level-1 {
  border: 1px solid  rgb(30,130,231) !important;
  background-color:  rgb(var(--v-theme-foreground)) !important;
  color:  rgb(var(--v-theme-primary_text));
  padding: 6px 12px !important;
  border-radius: 18px !important;
}

.label-cluster-level-2 {
  border: 1px solid rgb(14,99,241) !important;
  background-color:  rgb(var(--v-theme-foreground)) !important;
  color:  rgb(var(--v-theme-primary_text));
  padding: 6px 12px !important;
  border-radius: 18px !important;
}

.label-cluster-level-3 {
  border: 1px solid  rgb(10,35,255) !important;
  background-color:  rgb(var(--v-theme-foreground)) !important;
  color:  rgb(var(--v-theme-primary_text));
  padding: 6px 12px !important;
  border-radius: 18px !important;
}

.floating-poi {
  position: absolute;
  bottom: 20px;
  width: 30px;
  right: 10px;
  z-index: 10000;
}

.floating-tools {
  position: absolute;
  top: 20px;
  width: 170px;
  right: 50px;
  z-index: 10000;
}

@media (max-width: 420px) {
  .floating-tools {
    width: 150px;
    right: 2px;
    z-index: 10000;
  }
}

.floating-search {
  position: absolute;
  top: 20px;
  width: 280px;
  left: 15px;
  z-index: 10000;
}

@media (max-width: 420px) {
  .floating-search {
    width: 150px;
    left: 0;
    z-index: 10000;
  }
}

.floating-results {
  position: absolute;
  top: 70px;
  width: 280px;
  left: 15px;
  z-index: 10000;
  overflow-y: auto;
  height: calc(100vh - 80px);
}

.floating-search-docked {
  display: none;
}

.floating-filters {
  position: absolute;
  top: 20px;
  width: 800px;
  margin-left: 340px !important;
  z-index: 10000;
}

.floating-bottom {
  text-align: center;
  position: absolute;
  bottom: 20px;
  width: 400px;
  left: 50%;
  margin-left: -200px !important;
  z-index: 10000;
}

.map-fullscreen {
  position: fixed;
  top: 0;
  width: 100vw !important;
  height: 100vh;
  left: 0;
  z-index: 2000;
  border-radius: 0 !important;
}

.active-poi {
  background-color: #212C3D;
}

.leaflet-popup-content {
  margin: 8px !important;
}
</style>