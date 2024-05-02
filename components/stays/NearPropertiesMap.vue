<template>
    <v-card class="mb-3" variant="tonal" rounded="xl">
        <client-only>
            <l-map :zoom="zoom" style="height: 650px" :center="center" :use-global-leaflet="false">
                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                <l-marker v-for="item in markers" :lat-lng="item.Marker" :icon="nearIcon" @click="$emit('goTo', item)">
                    <l-tooltip :options="tooltipOptions">{{ item.Name }}</l-tooltip>
                </l-marker>
                <l-marker :lat-lng="center" :icon="principalIcon">
                    <l-tooltip>Hotel seleccionado: <strong>{{ principal.Name }}</strong></l-tooltip>
                </l-marker>
            </l-map>
        </client-only> 
    </v-card>
</template>

<script setup>
const props = defineProps(["items", "principal"])
const zoom = ref(12)
const url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
const center = [props.principal.Location.Latitude, props.principal.Location.Longitude]

const nearProperties = computed(() => {
    return props.items.filter(item => item.Name !== props.principal.Name);
});

const markers = computed(() => {
    return nearProperties.value.map(item => {
        return {
            ...item,
            Marker: [item.Location.Latitude, item.Location.Longitude]
        };
    })
})


const tooltipOptions = {
    permanent: true,
    direction: 'right',
};

const L = ref(null);
const nearIcon = ref(null)
const principalIcon = ref(null)

function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (process.client) {
      import('leaflet')
        .then((leaflet) => {
          L.value = leaflet.default;
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
    .then(() => {
      nearIcon.value = new L.value.Icon({
        iconUrl: '/img/icons/near_hotels.png',
        iconSize: [40, 40], 
        iconAnchor: [8, 8], 
      });

      principalIcon.value = new L.value.Icon({
        iconUrl: '/img/icons/actual_location.png',
        iconSize: [40, 40], 
        iconAnchor: [8, 8], 
      });
    })
    .catch((error) => {
      console.error('Error al cargar Leaflet:', error);
    });
});





</script>
