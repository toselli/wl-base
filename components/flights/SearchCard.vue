<template>
  <v-form v-model="valid">
    <v-row no-gutters>
      <v-col :cols="compact ? 10 : 12">
        <v-row dense align="end">
          <v-col cols="12" sm="4">
            <v-btn-toggle v-model="selectedClass" mandatory color="secondary" class="bg-foreground pa-1 text-secondary"
              variant="flat" rounded="sm" style="height:30px" selected-class="btn-toggle-selected">
              <v-btn size="small" rounded="sm" class="text-secondary bg-foreground mx-1" :value="_class" v-for="_class in classes">
                {{ $t(`classes.${_class.label}`) }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="12" sm="4" :class="compact ? 'text-center justify-start' : 'justify-center'" class="d-flex">
            <v-btn-toggle v-model="mode" density="compact" mandatory color="secondary" class="bg-foreground"
              variant="flat" rounded="sm" selected-class="bg-secondary btn-toggle-selected">
              <v-btn size="small" class="my-1 mx-1 body-3 text-secondary bg-foreground" rounded="sm" >
                <v-icon size="18" icon="md:arrow_right_alt"></v-icon> Sólo ida
              </v-btn>
              <v-btn size="small" class="my-1 mx-1 body-3 text-secondary bg-foreground" rounded="sm">
                <v-icon icon="md:swap_horiz"></v-icon> Ida y vuelta
              </v-btn>
              <v-btn size="small" class="my-1 mx-1 body-3 text-secondary bg-foreground" rounded="sm">
                <v-icon icon="md:multiple_stop"></v-icon> Varios destinos
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="12" sm="4" :class="!isMobile ? 'text-end align-end' : ''">
            <v-tooltip location="left" color="secondary">
              <template v-slot:default>
                <div style="width:250px" class="body-2">
                  Para búsquedas NDC en moneda USD, solo traerá resultados Copa Airlines. Para cotizar con otras
                  aerolíneas
                  NDC, seleccione la moneda ARS.
                </div>
              </template>
              <template v-slot:activator="{ props }">

                <v-icon size="18" icon="md:info_outline" color="secondary_text" class="mr-2" v-bind="props">

                </v-icon>
              </template>

            </v-tooltip>
            <v-btn-toggle v-model="currencySelected" mandatory color="secondary"
              class="bg-foreground pa-1 text-secondary" variant="flat" rounded="sm" style="height:30px"
              selected-class="btn-toggle-selected">
              <v-btn size="small" rounded="sm" class="text-secondary bg-foreground mx-1" :value="currency" v-for="currency in currencies">
                {{ currency }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" :sm="compact ? '10' : '12'" id="col_search_card">
        <v-card rounded="lg" class="search-card" flat :class="compact ? 'mb-1 bg-transparent' : 'pa-4 bg-foreground'"
          id="search_card">
          <v-card :rounded="compact ? 'lg' : ''" flat
            :class="compact ? 'pa-1 mb-2 border-secondary bg-foreground' : 'bg-foreground'">
            <v-row dense no-gutters :class="noresults ? 'justify-center' : ''" align="start">
              <v-col cols="12" sm="10" :class="compact ? '' : 'pr-2'">
                <v-row align="start" dense :no-gutters="compact" v-for="(segment, index) in segments">
                  <v-col cols="12" :class="compact ? 'px-2' : ''" v-if="mode == Modes.Multiple">
                    <h5 class="fw-bold">Tramo {{ index + 1 }}</h5>
                  </v-col>
                <v-col cols="12" sm="9" :class="compact ? '' : 'pr-2'">
                <v-row dense no-gutters>
                  <v-col cols="12" sm="6" :class="compact ? '' : 'pr-2'">
                    <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                      <v-icon icon="md:location_on" color="foreground" size="16"></v-icon> </v-avatar><span
                      class="body-1 semi" v-if="!compact">{{ $capitalize($t("origin")) }}</span>
                    <CommonPlacesSearch :compact="compact" :label="$capitalize($t('origin_place'))" serviceType="1"
                      :length="40" :searchedPlace="segment.originAirport"
                      @update:selectedPlace="place => handleOriginPlace(index, place)" />
                  </v-col>
                  <v-col cols="12" sm="6" :class="compact ? 'px-2' : ''">
                    <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                      <v-icon icon="md:location_on" color="foreground" size="16"></v-icon> </v-avatar>
                    <span class="body-1 semi" v-if="!compact">{{ $capitalize($t("going_to")) }}</span>
                    <CommonPlacesSearch :compact="compact" :label="$capitalize($t('destination_place'))" serviceType="1"
                      :length="40" :searchedPlace="segment.destinationAirport"
                      @update:selectedPlace="place => handleDestinationPlace(index, place)" />
                  </v-col></v-row>
              </v-col>                 
                  <v-col cols="12" :sm="mode == Modes.Multiple && segments.length > 1 ? '2' : '3'" :class="(mode === Modes.Multiple && segments.length > 1) ? '' : (compact ? 'pr-2' : 'pr-2')">
                    <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                      <v-icon icon="mdi-calendar-today" color="foreground" size="x-small"></v-icon> </v-avatar>
                    <span class="body-1 semi " v-if="!compact">Fecha{{ mode == Modes.Roundtrip ? 's' : '' }}
                    </span>
                    <CommonDatePicker v-if="mode != Modes.Roundtrip" :compact="compact" :searchedDate="segment.departureDate" :minDate="new Date()"  @update:selectedDate="handleDepartureDate($event, segment)" />
                    <CommonDatePicker v-else :compact="compact" :searchedDate="segment.dates" :multiple="true" :minDate="new Date()" :labelDays="$t('days')" @update:selectedDate="handleRoundDate($event, segment)" />
                    
                   <v-switch v-model="flexMode" inset label="Fecha flexible (solo GDS)" density="compact" color="secondary"
                    class="body-3 mt-n1" hide-details></v-switch>
                  </v-col>
                  <v-col cols="12" sm="1" v-if="mode == Modes.Multiple && segments.length > 1">
                    <div class="d-flex align-items-bottom mt-">
                      <v-btn v-if="index > 0" class="semi" color="transparent" variant="flat" rounded="lg"
                        @click="segments.splice(index, 1)">
                        <v-icon size="24" icon="md:delete" color="error"></v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row dense v-if="mode == Modes.Multiple">
                  <v-col cols="12" :class="compact ? 'px-4' : ''">
                    <v-btn size="small" class="semi" color="secondary" variant="tonal" rounded="lg"
                      @click="addNewSegment">
                      <v-icon size="16" icon="md:add"></v-icon>
                      <span class="body-2 ml-1">
                        Añadir destino
                      </span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" sm="2" :class="mode == Modes.Multiple ? 'mt-7' : ''">
                    <CommonOccupancies @update:rooms="setOccupancies" :compact="compact" :themed="themed"
                      serviceType="flights">
                    </CommonOccupancies>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
      </v-col>
      <v-col class="d-flex justify-center pa-2 " :class="compact ? 'text-end' : 'text-center'">
        <div class="d-flex text-center">
          <v-btn rounded="md" color="primary" :variant="compact ? 'tonal' : 'flat'" :class="compact ? 'semi' : 'semi  '" :block="isMobile"
            :disabled="!valid" :size="compact ? 'large' : 'x-large'" prepend-icon="mdi-magnify" @click="searchResults">
            {{ $capitalize($t("search")) }}
          </v-btn>
        </div>
      </v-col>

    </v-row>
  </v-form>
</template>

<script setup lang="ts">
const dayjs = useDayjs()
const isMobile = useMobile()
const props = defineProps(["compact", "noresults", "nologo", "themed", "divider"]);
const store = useFlightsStore()

import { useTheme } from 'vuetify/framework';
const theme = ref(useTheme())

const dpConfig = { keepActionRow: true, closeOnAutoApply: true }

//MODES
enum Modes {
  Outbound = 0,
  Roundtrip = 1,
  Multiple = 2
}
const mode: Ref<Modes> = ref(0)


//MISC
const classes = ref([{ code: "Y", label: "Economy" }, { code: "C", label: "Business" }])
const selectedClass = ref({ code: "Y", label: "Economy" })
const flexMode = ref(false)
const occupancies = ref([])
const currencies = ["ARS", "USD"]
const currencySelected = ref("ARS")

const setOccupancies = ($e) => {
  occupancies.value = $e.value

}

const dp = ref();


//AIRPORTS & SEGMENTS
const segments: Ref<any> = ref([{}])


const handleOriginPlace = (index, place) => {
  segments.value[index].originAirport = place;
}

const handleDestinationPlace = (index, place) => {
  segments.value[index].destinationAirport = place;
}


watch(segments, (change) => {
  store.clearAirports()
}, { deep: true })

watch(mode, () => {
  if (mode.value != Modes.Multiple) {
    segments.value = [segments.value[0]]
  }
})

const handleDepartureDate = (date, segment) => {
  segment.departureDate = date;
}

const handleRoundDate = (dates, segment) => {
  segment.arrivalDate = dates[1]
  segment.departureDate = dates[0]
}

function addNewSegment() {
  const previousSegment = segments.value[segments.value.length - 1]
  const newSegment = {
    originAirport: previousSegment.destinationAirport
  }
  segments.value.push(newSegment)
}


//#region SEARCH


async function searchResults() {
  const segmentStrings: string[] = []
  for (let segment of segments.value) {
    const departureStr = dayjs(segment.departureDate).format('YYYY-MM-DD')
    const arrivalStr = mode.value == Modes.Roundtrip ? dayjs(segment.arrivalDate).format('YYYY-MM-DD') : '';
    const originAirportCode = segment.originAirport?.Id
    const destinationAirportCode = segment.destinationAirport?.Id
    const str = `${departureStr}!${arrivalStr}!${originAirportCode}!${destinationAirportCode}`
    segmentStrings.push(str)
  }

  const segmentQuery = segmentStrings.join('|')

  const paxesStr = useOccupancies.stringify(occupancies.value)
  const route = useRoute();
  const router = useRouter();
  const query = {
    flightType: mode.value + 1,
    classPref: selectedClass.value?.code,
    segments: segmentQuery,
    nationality: "AR",
    residence: "AR",
    currency: currencySelected.value,
    occupancies: paxesStr
  }

  if (flexMode.value) {
    Object.assign(query, { flex: true })
  }

  //NUEVA BUSQUEDA DESDE RESULTS
  if (route.path == "/flights/results") {
    router.replace({
      path: "/flights/results",
      query: query
    }).then(() => {

    })
  }
  else {
    //BUSQUEDA NORMAL
    navigateTo({
      path: "/flights/results",
      query: query
    })
  }
}

onMounted(() => {
  const route = useRoute();
  mode.value = <Modes>((route.query.flightType as unknown as number) - 1) || 1
  occupancies.value = useOccupancies.parse(<string>route.query.occupancies)
  const segmentsCopy = useSegments();
  flexMode.value = route.query.flex === 'true' ? true : false
  segments.value = segmentsCopy.length > 0 ? segmentsCopy : [{}]
  currencySelected.value = route.query.currency ? route.query.currency : "ARS"
 
  const today = new Date();
  const tomorrow = dayjs(today).add(1, 'days').toDate()


  for (let segment of segments.value) {
    segment.departureDate = new Date(segment.DepartureDate ? segment.DepartureDate : today)
    segment.arrivalDate = new Date(segment.ArrivalDate ? segment.ArrivalDate : tomorrow)
    segment.dates = [segment.departureDate, segment.arrivalDate]
    store.getAirport(segment.OriginLocationCode)
      .then(res => {
        segment.originAirport = res;
      })

    store.getAirport(segment.DestinationLocationCode)
      .then(res => {
        segment.destinationAirport = res;
      })
  }
})


//#endregion
const { requiredRules } = useFormRules('');
const valid = ref(false)


</script>

<style lang="scss">
.v-tooltip .v-overlay__content {
  background-color: rgb(var(--v-theme-secondary_text)) !important;
}

.action-sheet {
  box-shadow: 0px 5px 9px rgb(var(--v-theme-secondary_text));
  margin-top: 5px;
  margin-bottom: -25px;
  width: 100%;

}


</style>
