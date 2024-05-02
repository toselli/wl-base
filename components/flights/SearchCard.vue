<template>
  <v-form v-model="valid">
    <v-row no-gutters>
      <v-col :cols="compact ? 10 : 12">
        <v-row dense align="end">
          <v-col cols="12" sm="4" v-if="!compact">
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
                <div style="width:250px" class="body-1">
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
        <v-card rounded="md" class="search-card" flat :class="compact ? 'mb-1 bg-transparent' : 'pa-4 bg-foreground'"
          id="search_card">
          <v-card :rounded="compact ? 'md' : ''" flat
            :class="compact ? 'pa-1 mb-2 border-secondary bg-foreground' : 'bg-foreground'">
            <v-row dense no-gutters :class="noresults ? 'justify-center' : ''">
              <v-col cols="12" sm="10" :class="compact ? '' : 'pr-2'">
                <v-row class="align-center" dense :no-gutters="compact" v-for="(segment, index) in segments">
                  <v-col cols="12" :class="compact ? 'px-2' : ''" v-if="mode == Modes.Multiple">
                    <h5 class="fw-bold">Tramo {{ index + 1 }}</h5>
                  </v-col>
                <v-col cols="12" sm="9" :class="compact ? 'px-2' : 'pr-2'">
                <v-row dense no-gutters>
                  <v-col cols="12" sm="6" :class="compact ? 'px-2' : 'pr-2'">
                    <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                      <v-icon icon="md:location_on" color="foreground" size="16"></v-icon> </v-avatar><span
                      class="body-1 semi" v-if="!compact">{{ $capitalize($t("origin")) }}</span>
                    <CommonPlacesSearch :compact="compact" :label="$capitalize($t('origin_place'))" serviceType="1"
                      :length="45" :searchedPlace="segment.originAirport"
                      @update:selectedPlace="place => handleOriginPlace(index, place)" />
                  </v-col>
                  <v-col cols="12" sm="6" :class="compact ? 'px-2' : ''">
                    <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                      <v-icon icon="md:location_on" color="foreground" size="16"></v-icon> </v-avatar>
                    <span class="body-1 semi" v-if="!compact">{{ $capitalize($t("going_to")) }}</span>
                    <CommonPlacesSearch :compact="compact" :label="$capitalize($t('destination_place'))" serviceType="1"
                      :length="45" :searchedPlace="segment.destinationAirport"
                      @update:selectedPlace="place => handleDestinationPlace(index, place)" />
                  </v-col></v-row>
              </v-col>                 
                  <v-col cols="12" :sm="mode == Modes.Multiple && segments.length > 1 ? '2' : '3'" :class="compact ? 'pr-2' : 'pr-2'">
                    <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                      <v-icon icon="mdi-calendar-today" color="foreground" size="x-small"></v-icon> </v-avatar>
                    <span class="body-1 semi " v-if="!compact">Fecha{{ mode == Modes.Roundtrip ? 's' : '' }}
                    </span>

                    <v-no-ssr>

                      <VueDatePicker v-if="mode != Modes.Roundtrip" v-model="segment.departureDate" ref="dp"
                        class="search-datepicker-input" :class="compact ? '' : ' mt-2'" :clearable="false" auto-apply :dark="theme.name != 'ThemeLight'"
                        :config="dpConfig" :teleport="true" :enable-time-picker="false" locale="es"
                        :min-date="new Date()" :action-row="{ showSelect: false, showCancel: false }"
                        @date-update="$event => valiDate($event, segment, 'departure')">
                        <template #action-preview="{ value }">
                          <v-sheet class="px-4 bg-transparent">
                            <v-switch density="compact" inset v-model="flex" color="secondary" hide-details>
                              <template v-slot:label>
                                <span class="body-1 semi text-primary_text">Fechas flexibles</span>
                              </template>
                            </v-switch>
                          </v-sheet>
                        </template>
                        <template #dp-input="{ }">
                          <div class="d-flex">
                            <v-btn class="btn-search-date" :variant="(compact && !isMobile) ? 'tonal' : themed">
                              <v-icon size="18" :icon="flex ? 'md:date_range' : 'md:event'" class="mr-2"></v-icon>
                              {{ $dayjs(segment.departureDate).format("DD/MM/YYYY") }}
                            </v-btn>
                          </div>
                        </template>
                      </VueDatePicker>
                      <!-- IDA Y VUELTA -->
                      <VueDatePicker v-else v-model="segment.dates" class="search-datepicker-input" range ref="dp"
                        multi-calendars :class="compact ? '' : ' mt-2'" :clearable="false"
                        :action-row="{ showCancel: false, showSelect: false }" auto-apply :config="dpConfig" :dark="theme.name != 'ThemeLight'"
                        :teleport="true" :enable-time-picker="false" locale="es" :min-date="new Date()"
                        @update:model-value="$event => valiDate($event, segment, 'roundtrip')">
                        <template #action-preview="{ value }">
                          <v-sheet class="px-4 bg-transparent">
                            <v-switch density="compact" inset v-model="flex" color="secondary">
                              <template v-slot:label>
                                <span class="body-1 semi text-primary_text">Fechas flexibles</span>
                              </template>
                            </v-switch>
                          </v-sheet>
                        </template>
                        <template #dp-input="{ }">
                          <div class="d-flex">
                            <v-btn class="btn-search-date" :variant="(compact && !isMobile) ? 'tonal' : themed">
                              <v-icon size="18" :icon="flex ? 'md:date_range' : 'md:event'" class="mr-2"></v-icon>
                              {{ $dayjs(segment.dates[0]).format("DD/MM/YYYY") }} -
                              {{ $dayjs(segment.dates[1]).format("DD/MM/YYYY") }}

                            </v-btn>

                          </div>
                        </template>
                      </VueDatePicker>
                    </v-no-ssr>
                  </v-col>
                  <v-col cols="12" sm="1" v-if="mode == Modes.Multiple && segments.length > 1">
                    <div class="d-flex align-items-bottom mt-7">
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
          <v-btn rounded="md" color="primary" variant="flat" :class="compact ? 'semi' : 'semi  '" :block="isMobile"
            :disabled="!valid" :size="compact ? 'large' : 'x-large'" prepend-icon="mdi-magnify" @click="searchResults">
            {{ $capitalize($t("search")) }}
          </v-btn>
        </div>
      </v-col>

    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import dayjs from "dayjs";
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
const flex = ref(false)
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

const valiDate = (isoDate: string | string[], segment, mode: 'arrival' | 'departure' | 'roundtrip') => {
  if (mode == 'roundtrip') {
    segment.arrivalDate = segment.dates[1]
    segment.departureDate = segment.dates[0]
  }
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

  if (flex.value) {
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
