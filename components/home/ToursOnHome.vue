<template>
    <v-container fluid class="pa-0">
        <v-card class="bg-transparent" flat v-for="tourType in getToursOnHome">
            <v-card-subtitle class="pa-0 text-primary_text body-1 text-secondary_text" >
                {{ tourType[0].TourType.TourModeRef.Value }}
            </v-card-subtitle> 
            <h3 class="semi pa-0 mb-2">
                {{ tourType[0].TourType.Value }}
                <a :href="buildTypeLink(tourType[0].TourType)" target="_blank">
                    <v-btn color=secondary variant="tonal" append-icon="mdi-chevron-right" density="compact" class="ml-5">
                        <span class="body-2 semi">Ver más <span v-if="false">{{ tourType[0].TourType.Value }}</span> </span>
                    </v-btn>
                </a>
            </h3>
            <v-row class="mb-5">
                <v-col cols="12" md="6" v-for="tour in tourType[0].Tours">
                    <a :href="buildTourLink(tour)" target="_blank">
                        <v-card rounded="lg">
                            <v-img cover :src="toImg(tour)"></v-img>
                        </v-card>
                        <h4 class="pa-0 semi mt-1">
                            {{ $sentence(tour.Title) }}
                        </h4>
                        <v-card-subtitle class="body-1 pa-0 text-primary_text">
                            {{ tour.Caption }}
                        </v-card-subtitle>
                    </a>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script setup>
const webStore = useWebStore();
const { fetchToursOnHome } = webStore;
const { getToursOnHome } = storeToRefs(webStore)

const toImg = (tour) => {
    return "https://media.agenciavirtual.net/" + "public/agencies/" + tour.AgencyId + "/tours/" + tour.DefaultImage
}

const buildTourLink = (tour) => {
    ///0622TWPWEJ/disney-dream-4-noches?departureId=0622AL1OYO
    return `https://www.ebooking.com.ar/#/salidas/detalle/${tour.Token}/${tour.TitleForUrl}?${tour.Departures[0].Id}`
}

const buildTypeLink = (type) => {
    ///0622TWPWEJ/disney-dream-4-noches?departureId=0622AL1OYO
    const modeRoute = type.TourModeRef.Value.toLowerCase().replace(' ', '-')
    return `https://www.ebooking.com.ar/#/salidas/buscar/${modeRoute}/${type.PageRoute}`
}

onMounted(() => {
    fetchToursOnHome() 
})
</script>

<style>
a {
    text-decoration: none;
    color: rgb(var(--v-theme-primary_text));
}
</style>