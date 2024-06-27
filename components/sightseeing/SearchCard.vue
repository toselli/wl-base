<template>
  <v-row dense justify="center">
    <v-col cols="12" :sm="compact ? '6' : '8'" id="col_search_card">
      <v-card rounded="lg" class="search-card" flat :class="compact ? 'mb-1 bg-transparent' : ' pa-4 bg-foreground'"
        id="search_card">
        <v-row dense no-gutters :class="noresults ? 'justify-center' : ''">
          <v-col cols="12">
            <v-card :rounded="compact ? 'lg' : ''" flat
              :class="compact ? 'pa-1 mb-2 border-secondary bg-foreground' : 'bg-foreground'">
              <v-row class="align-center" dense :no-gutters="compact">
                <!-- INPUT DESTINO -->
                <v-col cols="8" :class="compact ? 'pr-2' : 'pr-2'">
                  <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                    <v-icon :icon="'mdi-map-marker'" color="foreground" size="x-small"></v-icon> </v-avatar><span
                    class="body-1 semi" v-if="!compact">{{ $capitalize($t('going_to')) }}</span>
                  <CommonPlacesSearch :compact="compact" :label="$capitalize($t('where_destination_are_you_going'))"
                    serviceType="5" :length="compact ? '85' : '85'" :searchedPlace="selectedDestination"
                    @update:selectedPlace="handleSelectedDestination" />
                </v-col>
                <v-col cols="4" class="text-center">
                  <v-btn rounded="md" color="primary" :variant="compact ? 'tonal' : 'flat'"
                    :class="compact ? 'semi mt-1' : 'semi mt-3'" :block="isMobile" :size="compact ? 'large' : 'x-large'"
                    prepend-icon="mdi-magnify" @click="searchResults" :disabled="!validForm">
                    {{ $capitalize($t("search")) }}
                  </v-btn>
                  <CommonSearchBy v-if="!compact && !nologo" />
                </v-col>

              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

//#region imports
const dayjs = useDayjs()



//#region boilerplate
const isMobile = useMobile()
const props = defineProps(["noplaces", "compact", "noresults", "nologo", "themed", "divider"]);
const route = useRoute();
//#endregion


//#region PLACES

const selectedDestination: Ref<any> = ref(null);

const handleSelectedDestination = (place: any) => {
  selectedDestination.value = place;
}


//#region lifecycles
onMounted(() => {
  if (route.query.destinationId) {
    selectedDestination.value = {
      Id: route.query.destinationId,
      SmartSearchEnum: 8,
      Name: decodeURI(route.query.destinationName as string)
    }
  }


});


//#endregion

//#region search

async function searchResults() {
  const router = useRouter();
  const query = {
    destinationId: selectedDestination.value.Id,
    destinationName: selectedDestination.value.Name,
  }

  //NUEVA BUSQUEDA DESDE RESULTS
  if (route.path == "/sightseeing/results") {
    router.replace({
      path: "/sightseeing/results",
      query: query
    }).then(() => {

    })
  }
  else {
    //BUSQUEDA NORMAL
    navigateTo({
      path: "/sightseeing/results",
      query: query
    })
  }
}
//#endregion

const validForm: Ref<boolean> = computed(() => {
  let valid: boolean =
    selectedDestination.value != null

  return valid;
})


</script>
