<template>
  <v-card class="mb-3" variant="tonal" rounded="xl" :loading="loading" v-if="results" :class="fullscreen ? 'map-fullscreen' : ''">
    <client-only>
      <l-map :zoom="zoom" style="height: 100vh; width:100%" :center="center" :use-global-leaflet="false"
        v-if="results.length > 0" id="map" :options="{ zoomControl: false }" @ready="$emit('ready'); updateCenter()">
        <l-control-zoom position="topright"></l-control-zoom>
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker v-for="item in markers" :lat-lng="item.marker" :icon="icon">
          <l-tooltip :options="tooltipOptions" v-if="tooltipVisibility" class="text-right">
            <h4>{{ item.Name }}</h4>${{ item.Total.toFixed(2) }}
          </l-tooltip>
          <l-popup :options="popupOptions">
            <v-row dense no-gutters>
              <v-col cols="12">
                <v-img :src="item.Thumb" height="180px" cover class="rounded-lg my-2">
                </v-img>
              </v-col>
              <v-col cols="12">
                <v-rating :model-value="item.Category" density="compact" size="x-small" color="orange" class="mt-1"
                  v-if="item.Category != '0'" readonly half-increments></v-rating>
                <h3 class="mb-1">
                  {{ item.Name }}
                </h3>
                <p class="body-2 text-secondary_text semi my-0">
                  <v-icon icon="mdi-map-marker" size="small"></v-icon>
                  <span>{{ item.Address }}, {{ item.City }}</span>
                </p>
                <p class="body-2 text-secondary_text ma-1" v-if="item.GuestRatingAverage">
                  <span>{{ item.GuestRatingAverage }}/5 <span v-if="item.GuestRatingQualification">{{
                    $capitalize($t(item.GuestRatingQualification)) }} </span>({{ item.GuestRatingCount }} {{
    $t('reviews') }})</span>
                </p>
                <h3 class="text-right">
                  USD {{ item.Total.toFixed(2) }}
                </h3>
              </v-col>
              <v-col cols="12">
                <v-btn color="primary" rounded="lg" variant="flat" block="" density="comfortable" class="mt-2"
                  @click="$emit('goTo', item)" @click.middle.prevent="$emit('goTotab', item)">{{
                    $capitalize($t('view_details')) }}</v-btn>
              </v-col>
            </v-row>
          </l-popup>
        </l-marker>
        <l-marker v-for="item in filteredPoi" :key="item.name" :lat-lng="item.marker" :icon="item.icon">
          <l-tooltip :options="tooltipPoiOptions">
            <h4>{{ item.name }}</h4>
            <p class="body-2" v-html="item.description"></p>
          </l-tooltip>
        </l-marker>
        <div class="floating-button">
          <v-btn v-for="poiType in poiTypes" :key="poiType" icon density="compact"
            :class="{ 'active-poi': showPoiLayer[poiType] }" class="my-1" @click="togglePoiLayer(poiType)">
            <v-img :src="'/img/icons/' + poiType + '.png'" width="15"></v-img>
          </v-btn>
        </div>
        <div :class="docked ? 'floating-search-docked' : 'floating-search'">
          <v-text-field variant="solo" rounded="lg" hide-details density="compact" label="Buscar hoteles" v-model="searchPromptModel"
            class="pt-0 mr-2"
            :placeholder="`Escriba nombre del hotel y presione la tecla Enter`" v-if="!showMap"></v-text-field>
        </div>
        <div class="floating-pagination">
          <v-btn icon density="compact" color="primary" @click="goToPage(currentPage - 1)" :disabled="currentPage === 0"
            class="mr-1">
            <v-icon icon="mdi-chevron-left" size="sm"></v-icon>
          </v-btn>
          <v-chip variant="elevated" color="primary">{{ currentPage + 1 }} de {{ totalPages }}</v-chip>
          <v-btn icon density="compact" color="primary" @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages - 1" class="ml-1">
            <v-icon icon="mdi-chevron-right" size="sm"></v-icon>
          </v-btn>         
        </div>
        <div class="floating-expand">
          <v-btn icon density="compact" @click="fullscreenMap()">
            <v-icon>mdi-fullscreen</v-icon>
          </v-btn>
          <v-btn icon density="compact" @click="docked = false; $emit('expand')" class="ml-1" v-if="docked && !fullscreen">
            <v-icon>mdi-dock-bottom</v-icon>
          </v-btn>
          <v-btn icon density="compact" @click="docked = true; $emit('expand')" class="ml-1" v-else-if="!fullscreen">
            <v-icon>mdi-dock-right</v-icon>
          </v-btn>
          <v-btn icon density="compact" class="ml-1" @click="hideTooltip()">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </div>
        <div class="floating-filter">
          <stays-filters :filters="filters" v-if="filters && fullscreen" :compact="true"
            @apply="emitFilters" />
            </div>
      </l-map>
    </client-only>
  </v-card>
</template>

<script setup>
const props = defineProps(["token", "place", "filters", "results"])
const zoom = ref(10)
const url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
const loading = ref(false)

const icon = ref(null)
const center = ref([])

function updateCenter() {
  let firstItem = props.results[0];
  center.value = [firstItem.Latitude, firstItem.Longitude]
}
const markers = computed(() => {
  const startIndex = currentPage.value * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, props.results.length);

  return props.results.slice(startIndex, endIndex).map(item => ({
    ...item,
    marker: [item.Latitude, item.Longitude]
  }));
})
const tooltipVisibility = ref(true)

function hideTooltip() {
  tooltipVisibility.value = !tooltipVisibility.value
}

const tooltipOptions = {
  permanent: true,
  interactive: true,
};

const popupOptions = {
  minWidth: 360,
};


//PAGINATION

const itemsPerPage = 50;
const currentPage = ref(0);

const totalPages = computed(() => Math.ceil(props.results.length / itemsPerPage));

function goToPage(page) {
  currentPage.value = Math.max(0, Math.min(page, totalPages.value - 1));
}

//SEARCH

const searchPromptModel = ref('')

watch(searchPromptModel, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        emitPrompt(newValue);
        currentPage.value = 0 
    }
});

const emit = defineEmits(['update:prompt','update:filters'])

const emitPrompt = (value) => {
    emit('update:prompt', value);
};

const emitFilters = (value) => {
    emit('update:filters', value);
};

//LEAFLET
const L = ref(null);

function loadLeaflet() {
  let firstItem = props.results[0];
  center.value = [firstItem.Latitude, firstItem.Longitude + 0.445]
  return new Promise((resolve, reject) => {
    if (process.client) {
      import('leaflet')
        .then((leaflet) => {
          L.value = leaflet.default;
          icon.value = new L.value.Icon({
            iconUrl: '/img/icons/near_hotels.png',
            iconSize: [30, 30],
            iconAnchor: [15, 12],
          });
          poiIcons.value = {
            museum: new L.value.Icon({
              iconUrl: '/img/icons/museum.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            theatre: new L.value.Icon({
              iconUrl: '/img/icons/theatre.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            attraction: new L.value.Icon({
              iconUrl: '/img/icons/attraction.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            restaurant: new L.value.Icon({
              iconUrl: '/img/icons/restaurant.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            sports_centre: new L.value.Icon({
              iconUrl: '/img/icons/sports_centre.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            viewpoint: new L.value.Icon({
              iconUrl: '/img/icons/viewpoint.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            nightclub: new L.value.Icon({
              iconUrl: '/img/icons/nightclub.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            park: new L.value.Icon({
              iconUrl: '/img/icons/park.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            aerodrome: new L.value.Icon({
              iconUrl: '/img/icons/aerodrome.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
            // Agrega más tipos y sus iconos aquí
          };
          loadPOI()
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(new Error('Leaflet solo puede cargarse en el contexto del navegador.'));
    }
  });
}

onMounted(() => {
  loadLeaflet()
});

//POI

const poiIcons = ref({})
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
  const cuisine = tags.cuisine ? `Tipo de cocina: ${tags.cuisine}</br>` : '';
  const phone = tags.phone ? `Teléfono: ${tags.phone}</br>` : '';
  const address = tags.address ? `Dirección: ${tags.address}</br>` : '';
  const website = tags.website ? `<a href="${tags.website}">${tags.website}</a>` : '';
  return `${cuisine}${phone}${address}${website}`;

}

const filteredPoi = computed(() => {
  const selectedPoiTypes = Object.keys(showPoiLayer.value).filter(poiType => showPoiLayer.value[poiType]);
  return poi.value.filter(item => selectedPoiTypes.includes(item.type));
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
    type !== "hostel" && type !== "yes" && type !== "leisure_centre"
  );
  return filteredTypes;
});

const showPoiLayer = ref({});

function togglePoiLayer(poiType) {
  showPoiLayer.value = { ...showPoiLayer.value, [poiType]: !showPoiLayer.value[poiType] };
}
const docked = ref(false)

const fullscreen = ref(false)
function fullscreenMap() {
  fullscreen.value = !fullscreen.value
}
</script>

<style>
.floating-button {
  position: absolute;
  bottom: 20px;
  width: 30px;
  right: 10px;
  z-index: 10000;
}

.floating-expand {
  position: absolute;
  top: 20px;
  width: 120px;
  left: 10px;
  z-index: 10000;
}

.floating-pagination {
  position: absolute;
  top: 20px;
  width: 150px;
  left: 50%;
  margin-left: -75px !important;
  z-index: 10000;
}

.floating-search {
  position: absolute;
  top: 20px;
  width: 280px;
  left: 68%;
  margin-left: -75px !important;
  z-index: 10000;
}

.floating-search-docked {
  display: none;
}

.floating-filter {
  position: absolute;
  top: 10px;
  width: 400px;
  margin-left: 125px !important;
  z-index: 10000;
}

.map-fullscreen {
  position: fixed;
  top: 0;
  width: 100vw !important;
  height: 100vh;
  left: 0;
  z-index: 1005;
  border-radius: 0 !important;
}

.active-poi {
  background-color: #212C3D;
}

.leaflet-popup-content {
  margin: 8px !important;
}</style>