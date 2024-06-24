<template>
  <v-form v-model="valid">
    <v-row dense>
      <v-col cols="12" :sm="compact ? '10' : '12'" id="col_search_card">
        <v-card rounded="lg" class="search-card" flat
          :class="compact ? 'mb-1 bg-transparent' : ' pa-4 bg-foreground'" id="search_card">
          <v-card :rounded="compact ? 'lg' : ''" flat
            :class="compact ? 'pa-1 mb-2 border-secondary bg-foreground' : 'bg-foreground pr-lg-3'">
            <v-row dense no-gutters :class="noresults ? 'justify-center' : ''">
              <v-col cols="12" sm="10" :class="compact ? '' : 'pr-2'">
                <v-row class="align-center" dense :no-gutters="compact">
                  <v-col cols="12" sm="4" :class="compact ? 'pr-2' : ''">
                    <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                      <v-icon icon="mdi-map-marker" color="foreground" size="x-small"></v-icon> </v-avatar><span
                      class="body-1 semi" v-if="!compact">{{ $capitalize($t("origin")) }}</span>
                    <AssistancesPlacesSearch :compact="compact" :label="$capitalize($t('search_origin'))"
                      :selectedPlace="selectedOrigin" @update:selectedPlace="handleSelectedOrigin" :origin="true" />
                  </v-col>
                  <v-col cols="12" sm="4" :class="compact ? 'pr-2' : ''">
                    <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                      <v-icon icon="mdi-map-marker-radius" color="foreground" size="x-small"></v-icon> </v-avatar>
                    <span class="body-1 semi" v-if="!compact">{{ $capitalize($t("going_to")) }}</span>
                    <AssistancesPlacesSearch :compact="compact" :label="$capitalize($t('destination_place'))"
                      :selectedPlace="selectedDestination" @update:selectedPlace="handleSelectedDestination"
                      :origin="false" />
                  </v-col>
                  <v-col cols="12" :sm="4" :class="compact ? 'pr-2' : ''">
                    <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                      <v-icon icon="mdi-calendar-today" color="foreground" size="x-small"></v-icon> </v-avatar><span
                      class="body-1 semi" v-if="!compact">Fechas</span>
                    <!-- INPUT FECHA -->
                    <CommonDatePicker :compact="compact" :searchedDate="selectedDate" :multiple="true" :minDate="new Date()" :labelDays="$t('days')" @update:selectedDate="handleSelectedDate" />
                  </v-col>
                </v-row>

              </v-col>
              <v-col cols="12" sm="2">
                <div>
                  <CommonOccupancies @update:rooms="setOccupancies" :compact="compact" :adultsAgeRequired="true" :themed="themed">
                  </CommonOccupancies>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="12" :sm="compact ? '2' : '12'" class="text-center">
        <v-btn rounded="md" color="primary" :variant="compact ? 'tonal' : 'flat'"
          :class="compact ? 'semi' : 'semi mt-3'" :block="isMobile" :size="compact ? 'large' : 'x-large'"
          prepend-icon="mdi-magnify" @click="searchResults" :disabled="!selectedOrigin || !selectedDestination">
          {{ $capitalize($t("search")) }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
const dayjs = useDayjs()
const isMobile = useMobile()
const props = defineProps(["compact", "noresults", "nologo", "themed", "divider"]);

//DATES
const selectedDate = ref(null)
const handleSelectedDate = (date) => {
  selectedDate.value = date;
}

//#region PLACES

const selectedOrigin = ref({ "es": "Argentina", "en": "Argentina", "code": "AR" })
const selectedDestination = ref(null)

//#region SEARCH

const occupancies = ref([])
const setOccupancies = ($e) => {
  occupancies.value = $e.value

}

const handleSelectedOrigin = (place) => {
  selectedOrigin.value = place;
}

const handleSelectedDestination = (place) => {
  selectedDestination.value = place;
}

const route = useRoute();
const router = useRouter();

async function searchResults() {
  const query = {
    arrivalDate: dayjs(selectedDate.value[0]).format('YYYY-MM-DD'),
    departureDate: dayjs(selectedDate.value[1]).format('YYYY-MM-DD'),
    origin: selectedOrigin.value.code,
    originName: selectedOrigin.value.es,
    destination: selectedDestination.value.Name,
    travelType: "Un viaje",
    occupancies: useOccupancies.stringify(occupancies.value)
  }

  //NUEVA BUSQUEDA DESDE RESULTS
  if (route.path == "/assistances/results") {
    router.replace({
      path: "/assistances/results",
      query: query
    }).then(() => {

    })
  }
  else {
    //BUSQUEDA NORMAL
    navigateTo({
      path: "/assistances/results",
      query: query
    })
  }
}

onMounted(() => {
  if (route.query.arrivalDate) {
    const urlCheckin = route.query.arrivalDate;
    const urlCheckout = route.query.departureDate;
    selectedDate.value = [dayjs(urlCheckin).format(), dayjs(urlCheckout).format()];
  }
})

//#endregion
const { requiredRules } = useFormRules('');
const valid = ref(false)


</script>