<template>
  <v-row dense>
    <v-col cols="12" :class="!compact ? 'text-center' : ''">
      <v-btn-toggle v-model="transferMode" density="compact" mandatory color="secondary"
        class="bg-foreground pa-1 text-secondary btn-toggle" variant="flat" rounded="sm"
        selected-class="btn-toggle-selected">
        <v-btn size="small" rounded="sm" class="text-secondary bg-foreground mx-1">
          <v-icon class="mr-1">mdi-ray-start-arrow</v-icon> Sólo ida
        </v-btn>
        <v-btn size="small" rounded="sm" class="text-secondary bg-foreground mx-1">
          <v-icon class="mr-1">mdi-repeat-variant</v-icon> Ida y vuelta
        </v-btn>
      </v-btn-toggle>
    </v-col>
    <v-col cols="12" :md="compact ? '10' : '12'">
      <v-card rounded="md" class="search-card" flat :class="compact ? 'mb-1 bg-transparent' : ' pa-4 bg-foreground'">
        <v-row dense no-gutters :class="noresults ? 'justify-center' : ''">
          <v-col cols="12">
            <v-card :rounded="compact ? 'md' : ''" flat
              :class="compact ? 'pa-1 mb-2 border-secondary bg-foreground' : ''"
              :variant="compact ? 'default' : 'default'">
              <v-row class="align-start" dense :no-gutters="compact">
                <!-- INPUT PLACES -->
                <v-col cols="12" :md="compact ? '7' : '6'" :class="compact ? 'pr-2' : ''">
                  <v-row class="align-center" dense>
                    <v-col cols="12" sm="6" :class="compact ? '' : 'pr-2'">
                      <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                        <v-icon :icon="selectedArrival?.SmartSearchEnum == 3 ? 'mdi-airplane-marker' : 'mdi-map-marker'"
                          color="foreground" size="x-small"></v-icon> </v-avatar><span class="body-1 semi"
                        v-if="!compact">{{
      $capitalize($t("from")) }}</span>

                      <CommonPlacesSearch :compact="compact" :label="$capitalize($t('arrival_place'))" serviceType="3"
                        :searchedPlace="selectedArrival" @update:selectedPlace="handleSelectedArrival" :length="40" />
                    </v-col>
                    <!-- <v-divider vertical cols="1" class="my-4 mx-1" :color="divider" v-if="!compact"></v-divider> -->
                    <!-- <common-divider-icon icon="mdi-swap-horizontal" class="my-1" vertical button v-if="!noplaces">
                    </common-divider-icon> -->
                    <v-col cols="12" sm="6" :class="compact ? '' : 'pr-2'">
                      <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                        <v-icon
                          :icon="selectedDestination?.SmartSearchEnum == 3 ? 'mdi-airplane-marker' : 'mdi-map-marker-distance'"
                          color="foreground" size="x-small"></v-icon> </v-avatar><span class="body-1 semi"
                        v-if="!compact">{{
      $capitalize($t("to")) }}</span>
                      <CommonPlacesSearch :compact="compact" :label="$capitalize($t('destination_place'))"
                        serviceType="3" :searchedPlace="selectedDestination"
                        @update:selectedPlace="handleSelectedDestination" :length="40" />

                    </v-col>
                  </v-row>
                </v-col>
                <!-- <v-divider vertical v-if="!compact" class="my-4" :color="divider"></v-divider> -->
                <!-- INPUT FECHA-->
                <v-col cols="12" :md="compact ? '4' : '4'" :class="compact ? 'py-2 py-sm-0' : ''">
                  <v-row class="align-center" dense :no-gutters="compact">
                    <v-col cols="12" sm="7" :class="compact ? 'pr-4' : 'pr-2'">
                      <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                        <v-icon icon="mdi-calendar-today" color="foreground" size="x-small"></v-icon> </v-avatar><span
                        class="body-1 semi" v-if="!compact">{{ $capitalize($t("date")) }} <span
                          v-if="selectedArrival?.SmartSearchEnum == 3">{{ $t("flight_arrival") }}</span>
                      </span>
                      <CommonDatePicker :compact="compact" :searchedDate="arrivalDate" :multiple="false"
                        :minDate="new Date()" @update:selectedDate="handleArrivalDate" />
                      <span class="body-3 text-warning" v-if="selectedArrival?.SmartSearchEnum == 3 && !compact">Por
                        favor
                        indique fecha del vuelo.</span>
                    </v-col>
                    <!-- INPUT HORA-->
                    <v-col cols="12" sm="5" class="pr-2">
                      <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                        <v-icon
                          :icon="selectedArrival?.SmartSearchEnum == 3 ? 'mdi-airplane-clock' : 'mdi-clock-outline'"
                          color="foreground" size="x-small"></v-icon> </v-avatar><span class="body-1 semi"
                        v-if="!compact">{{ $capitalize($t("hour")) }}
                        <span v-if="selectedArrival?.SmartSearchEnum == 3">{{ $t("flight") }}</span>
                      </span>
                      <CommonTimePicker :compact="compact" :searchedTime="arrivalTime"
                        @update:selectedTime="handleArrivalTime" />
                      <span class="body-3 text-warning" v-if="selectedArrival?.SmartSearchEnum == 3 && !compact">Además
                        del horario del
                        mismo.</span>
                    </v-col>
                  </v-row>
                </v-col>
                <!-- INPUT PASAJEROS -->
                <v-col cols="12" :md="compact ? '1' : '2'" :class="isMobile ? 'mt-3' : ''">
                  <CommonOccupancies @update:rooms="setOccupancies" :compact="compact" :themed="themed"
                    serviceType="transfers">
                  </CommonOccupancies>
                </v-col>
                <!-- IDA Y VUELTA -->
                <v-col cols="12" :md="compact ? '4' : '4'" :offset-md="compact ? '7' : '6'" v-if="transferMode == 1"
                  :class="compact ? 'mt-1' : 'mt-1 px-2'">
                  <p v-if="compact" class="body-2 semi pa-1">Fecha y hora regreso:</p>
                  <v-row dense :no-gutters="compact">
                    <v-col cols="7" :class="compact ? 'pr-4' : 'pr-2'">
                      <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                        <v-icon icon="mdi-calendar-today" color="foreground" size="x-small"></v-icon> </v-avatar><span
                        class="body-1 semi" v-if="!compact">Fecha regreso</span>
                      <CommonDatePicker :compact="compact" :searchedDate="departureDate" :multiple="false"
                        :minDate="arrivalDate" @update:selectedDate="handleDepartureDate" />
                    </v-col>
                    <v-col class="pr-2">
                      <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                        <v-icon icon="mdi-car-clock" color="foreground" size="x-small"></v-icon> </v-avatar><span
                        class="body-1 semi" v-if="!compact">Hora regreso</span>
                      <CommonTimePicker :compact="compact" :searchedTime="departureTime"
                        @update:selectedTime="handleDepartureTime" />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <!-- <v-divider vertical class="mx-3" v-if="!noplaces"></v-divider> -->
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12" :md="compact ? '2' : '12'" class="text-center">
      <v-btn rounded="md" color="primary" :variant="compact ? 'tonal' : 'flat'" :class="compact ? 'semi ' : 'semi mt-3'"
        :block="isMobile" :size="compact ? 'large' : 'x-large'" prepend-icon="mdi-magnify" @click="searchResults"
        :disabled="selectedArrival == null || selectedDestination == null || arrivalDate > departureDate">
        {{ $capitalize($t("search")) }}
      </v-btn>
      <CommonSearchBy v-if="!compact && !nologo" />
    </v-col>
  </v-row>
</template>

<script setup>
const isMobile = useMobile()
import { useTheme } from 'vuetify/framework';
const theme = ref(useTheme())

const props = defineProps(["noplaces", "compact", "noresults", "nologo", "themed", "divider"]);
const route = useRoute();

import dayjs from "dayjs";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
//DESIGN

const transferMode = ref(0)

//PLACES
const selectedArrival = ref(null);
const selectedDestination = ref(null)


const handleSelectedArrival = (place) => {
  selectedArrival.value = place;
}

const handleSelectedDestination = (place) => {
  selectedDestination.value = place;
}



//DATES
const arrivalDate = ref({});
const departureDate = ref({})

const handleArrivalDate = (date) => {
  arrivalDate.value = date;
}

const handleDepartureDate = (date) => {
  departureDate.value = date;
}

watch(arrivalDate, (newValue, oldValue) => {
  if (departureDate.value < arrivalDate.value) {
    departureDate.value = arrivalDate.value
  }
},
  { deep: true });

watch(departureDate, (newValue, oldValue) => {
  if (arrivalDate.value > departureDate.value) {
    arrivalDate.value = departureDate.value
  }
},
  { deep: true });

//TIME
const arrivalTime = ref({});
const departureTime = ref({});

const handleArrivalTime = (date) => {
  arrivalTime.value = date;
}

const handleDepartureTime = (date) => {
  departureTime.value = date;
}

//PAXES

const occupancies = ref([])

const setOccupancies = ($e) => {
  occupancies.value = $e.value
}

onMounted(() => {
  const date = new Date();
  if (route.query.arrivalDate && route.query.arrivalTime) {
    arrivalDate.value = route.query.arrivalDate;
    const [hoursStr, minutesStr] = route.query.arrivalTime.split(':');
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    arrivalTime.value = {
      hours: hours,
      minutes: minutes
    }
    selectedArrival.value = {
      Id: route.query.arrivalPointDataId,
      SmartSearchEnum: route.query.arrivalPointType,
      Name: route.query.arrivalPointName
    }
    selectedDestination.value = {
      Id: route.query.destinationPointDataId,
      SmartSearchEnum: route.query.destinationPointType,
      Name: route.query.destinationPointName
    }
    if (route.query.departureDate && route.query.departureTime) {
      transferMode.value = 1
      departureDate.value = route.query.departureDate;
      const [hoursStr, minutesStr] = route.query.departureTime.split(':');
      const hours = parseInt(hoursStr);
      const minutes = parseInt(minutesStr);
      departureTime.value = {
        hours: hours,
        minutes: minutes
      }
    } else {
      departureDate.value = route.query.arrivalDate;
      departureTime.value = {
        hours: hours,
        minutes: minutes
      }
    }
  } else {
    arrivalDate.value = date;
    arrivalTime.value = { hours: 10, minutes: 0 };
    departureDate.value = date;
    departureTime.value = { hours: 10, minutes: 0 };
  }
  if (route.path == "/stays/results") {
    selectedArrival.value = {
      Id: route.query.arrivalPointDataId,
      SmartSearchEnum: route.query.arrivalPointType,
      Name: route.query.arrivalPointName
    }
  }

});


async function searchResults() {
  const router = useRouter();
  const paxesStr = useOccupancies.stringify(occupancies.value)
  let query = {
    arrivalDate: dayjs(arrivalDate.value).format('YYYY-MM-DD'),
    arrivalTime: arrivalTime.value.hours + ':' + (arrivalTime.value.minutes < 10 ? '0' + arrivalTime.value.minutes : arrivalTime.value.minutes),
    arrivalPointDataId: selectedArrival.value.Id,
    arrivalPointType: selectedArrival.value.SmartSearchEnum,
    arrivalPointName: selectedArrival.value.Name,
    destinationPointDataId: selectedDestination.value.Id,
    destinationPointType: selectedDestination.value.SmartSearchEnum,
    destinationPointName: selectedDestination.value.Name,
    occupancies: paxesStr
  }
  if (transferMode.value == 1) {
    query.departureDate = dayjs(departureDate.value).format('YYYY-MM-DD'),
      query.departureTime = departureTime.value.hours + ':' + (departureTime.value.minutes < 10 ? '0' + departureTime.value.minutes : departureTime.value.minutes)
  }
  //NUEVA BUSQUEDA DESDE RESULTS
  if (route.path == "/transfers/results") {
    router.replace({
      path: "/transfers/results",
      query: query
    }).then(() => {
    })
  }
  else {
    //BUSQUEDA NORMAL
    navigateTo({
      path: "/transfers/results",
      query: query
    })
  }
}

</script>
