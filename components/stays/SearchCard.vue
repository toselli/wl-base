<template>
  <v-card rounded="md" class="search-card" flat :class="compact ? 'mb-1 bg-transparent' : ' pa-4 bg-foreground'">
    <v-row dense no-gutters :class="noresults ? 'justify-center' : ''">
      <v-col cols="12" :sm="compact && noplaces ? '4' : (compact ? '8' : '10')">
        <v-card :rounded="compact ? 'md' : ''"
          :class="compact ? 'pa-2 pa-md-1 mb-2 border-secondary bg-foreground' : 'bg-foreground'" flat>
          <v-row class="align-center justify-space-between" dense>
            <v-col cols="12" sm="6" v-if="!noplaces" class="pr-2">
              <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                <v-icon icon="mdi-map-marker" color="foreground" size="x-small"></v-icon> </v-avatar><span
                class="body-1 semi" v-if="!compact">{{ $capitalize($t("going_to")) }}</span>
              <!-- INPUT PLACES -->
              <CommonPlacesSearch :compact="compact" :label="$capitalize($t('where_are_you_going'))" serviceType="0"
                :searchedPlace="selectedPlace" @update:selectedPlace="handleSelectedPlace" />
            </v-col>
            <!-- <v-divider vertical class=" my-3" :color="divider" v-if="!noplaces"></v-divider> -->
            <v-col cols="12" :sm="noplaces ? '7' : '4'" :class="isMobile ? 'mt-3' : 'pr-2'">
              <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                <v-icon icon="mdi-calendar-today" color="foreground" size="x-small"></v-icon> </v-avatar><span
                class="body-1 semi" v-if="!compact">Check-in - Check-out</span>
              <!-- INPUT FECHA -->
              <CommonDatePicker :compact="compact" :searchedDate="selectedDate" :multiple="true" :minDate="new Date()" :labelDays="$t('nights')" @update:selectedDate="handleSelectedDate" />
            </v-col>
            <!-- <v-divider vertical class="my-3" :color="divider" v-if="!isMobile"></v-divider> -->
            <v-col cols="12" :sm="noplaces ? '5' : '2'" :class="isMobile ? 'mt-3' : ''">
              <CommonOccupancies @update:rooms="setOccupancies" :compact="compact" :themed="themed" serviceType="stays"
                :multiple="true">
              </CommonOccupancies>
            </v-col>
          </v-row>

        </v-card>
      </v-col>
      <v-col cols="12" sm="2" :class="noplaces ? '' : 'text-center'" class="mt-1 mt-md-0">
        <v-btn rounded="md" color="primary" :variant="compact ? 'tonal' : 'flat'"
          :class="compact ? 'semi mt-0 ml-2' : 'semi mt-2'" v-if="noplaces" :block="isMobile"
          :size="compact ? 'large' : 'x-large'" prepend-icon="mdi-magnify" @click="searchResults"
          :disabled="selectedDate.length == 0">
          {{ $capitalize($t("search")) }}
        </v-btn>
        <v-btn rounded="md" color="primary" :variant="compact ? 'tonal' : 'flat'"
          :class="compact ? 'semi' : 'semi mt-2'" v-else :block="isMobile" :size="compact ? 'large' : 'x-large'"
          prepend-icon="mdi-magnify" @click="searchResults" :disabled="selectedPlace == null || selectedDate.length == 0">
          {{ $capitalize($t("search")) }}
        </v-btn>

        <CommonSearchBy v-if="!compact && !nologo" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const isMobile = useMobile()

const props = defineProps(["noplaces", "compact", "noresults", "nologo", "themed"]);
const route = useRoute();

const dayjs = useDayjs()

//DESIGN

//PLACES

const selectedPlace = ref();

const handleSelectedPlace = (place) => {
  selectedPlace.value = place;
}

//DATES

const selectedDate = ref([])
const handleSelectedDate = (date) => {
  selectedDate.value = date;
}

//ROOMS
const rooms = ref([]);

const setOccupancies = ($e) => {
  rooms.value = $e.value
}

onMounted(() => {

  if (route.query.checkIn) {
    const urlCheckin = route.query.checkIn;
    const urlCheckout = route.query.checkOut;
    selectedDate.value = [dayjs(urlCheckin).format(), dayjs(urlCheckout).format()];
  } 
  if (route.path == "/stays/results") {
    if (route.query.place) {
      selectedPlace.value = {
        Id: route.query.id,
        Name: route.query.place
      }
    } else {
      selectedPlace.value = null
    }
  } else if (route.path == "/stays/details") {
    selectedPlace.value = {
      Id: route.query.id,
    }
  }
});

//SEARCH


async function searchResults() {
  const router = useRouter();
  const roomsString = useOccupancies.stringify(rooms.value)
  let query = {
    checkIn: dayjs(selectedDate.value[0]).format('YYYY-MM-DD'),
    checkOut: dayjs(selectedDate.value[1]).format('YYYY-MM-DD'),
    id: selectedPlace.value.Id,
    place: selectedPlace.value.Name,
    occupancies: roomsString
  };
  //SI BUSCAMOS HOTEL DIRECTAMENTE
  if (selectedPlace.value.SmartSearchEnum == 1) {
    navigateTo({
      path: "/stays/details",
      query: {
        id: query.id,
        checkIn: query.checkIn,
        checkOut: query.checkOut,
        currency: 'USD',
        occupancies: roomsString,
      },
    })
  } else {
    //NUEVA BUSQUEDA DESDE RESULTS
    if (route.path == "/stays/results") {
      router.replace({
        path: "/stays/results",
        query: {
          checkIn: query.checkIn,
          checkOut: query.checkOut,
          id: query.id,
          place: query.place,
          occupancies: roomsString,
        }
      }).then(() => {
      })
    }
    //NUEVA BUSQUEDA DESDE DETAILS/AVAIL
    else if (route.path == "/stays/details") {
      router.replace({
        path: "/stays/details",
        query: {
          id: route.query.id,
          checkIn: query.checkIn,
          checkOut: query.checkOut,
          currency: 'USD',
          occupancies: roomsString,
          place: route.query.place,
          placeid: route.query.placeid,
        }
      }).then(() => {
      })
    } else {
      //BUSQUEDA NORMAL
      navigateTo({
        path: "/stays/results",
        query: {
          checkIn: query.checkIn,
          checkOut: query.checkOut,
          id: query.id,
          place: query.place,
          occupancies: roomsString,
        },
        external: true,
        open: {
          target: '_blank'
        }
      })
    }

  }

}
</script>
