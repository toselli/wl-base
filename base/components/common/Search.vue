<template>
    <v-container fluid :class="compact ? 'search-container-compact pa-0' : 'search-container text-center py-0'">
        <v-sheet v-if="!compact" rounded="lg" class="pa-2 bg-midground ease" :class="isMobile ? '' : 'd-inline-block'">
            <v-tabs v-model="serviceType" grow class="text-secondary_text " color="secondary" align-tabs="center"
                :stacked="!compact" hide-slider  :density="compact ? 'compact' : 'default'"  :class="isMobile ? 'service-tabs-mobile' : ''">
                <v-tab :value="st.serviceType" v-for="st in  getServiceTypes " :class="!isMobile ? 'grow service-tab mx-1' : 'service-tab-mobile'"
                    :density="compact ? 'compact' : 'default'"@click.middle.prevent="handleMiddleClick($event, st.serviceType)" >
                    <v-icon :icon="st.icon" size="small"></v-icon>
                    <transition name="slide-fade" v-if="!isMobile">
                        <span :key="st.serviceType" v-show="!compact || serviceType == st.serviceType"> {{ st.name }} </span>
                    </transition>
                </v-tab>
                <v-tab :class="!isMobile ? 'service-tab grow mx-1' : 'service-tab-mobile'" @click="goToEbookingOld('salidas')">
                    <v-icon icon="md:luggage" size="small"></v-icon>
                    <transition name="slide-fade" v-if="!isMobile">
                      Paquetes
                    </transition>
                </v-tab>
                <v-tab :class="!isMobile ? 'service-tab grow mx-1' : 'service-tab-mobile'" @click="goToEbookingOld('atracciones')">
                    <v-icon icon="md:local_activity" size="small"></v-icon>
                    <transition name="slide-fade" v-if="!isMobile">
                      Atracciones
                    </transition>
                </v-tab>
                <v-tab :class="!isMobile ? 'service-tab grow mx-1' : 'service-tab-mobile'" @click="goToEbookingOld('cruceros')">
                    <v-icon icon="md:directions_boat_filled " size="small"></v-icon>
                    <transition name="slide-fade" v-if="!isMobile">
                      Cruceros
                    </transition>
                </v-tab>
                <v-tab :class="!isMobile ? 'service-tab grow mx-1' : 'service-tab-mobile'" @click="goToEbookingOld('disney')">
                    <v-icon icon="md:castle " size="small"></v-icon>
                    <transition name="slide-fade" v-if="!isMobile">
                      Disney
                    </transition>
                </v-tab>
            </v-tabs>
            {{compact}}
        </v-sheet>
        <!-- <CommonServiceTypesMobile v-else/> -->
        <v-window v-model="serviceType" class="rounded-lg text-left" :class="compact ? 'mt-1' : 'mt-4'">
            <v-window-item :value="1">
                <stays-search-card :compact="compact" :nologo="true" themed="tonal" />
            </v-window-item>
            <v-window-item :value="2">
                <TransfersSearchCard :compact="compact" :nologo="true" themed="tonal" />
            </v-window-item>
           <v-window-item :value="3">
                <CarsSearchCard :compact="compact" :nologo="true" themed="tonal" />
            </v-window-item>
              <v-window-item :value="4">
                <FlightsSearchCard :compact="compact" :nologo="true" themed="tonal" />
            </v-window-item> 
          <v-window-item :value="5">
                <AssistancesSearchCard :compact="compact" :nologo="true" themed="tonal" />
            </v-window-item>
            <v-window-item :value="6">
                <CircuitsSearchCard :compact="compact" :nologo="true" themed="tonal" />
            </v-window-item>
        </v-window> 
    </v-container>
</template>

<script setup>
const props = defineProps(['compact'])
const isMobile = useMobile()
//PLACES

const placesStore = usePlacesStore();
const { getServiceTypes } = storeToRefs(useWebStore())

const route = useRoute()
const serviceType = ref(1);
watch(serviceType, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        placesStore.places = [];
    }
});

function updateServiceType(to) {
    const pathMapping = {
        '/stays': 1,
        '/transfers': 2,
        '/cars': 3,
        '/flights': 4,
        '/assistances': 5,
        '/circuits': 6
    };

    let matchedPath = Object.keys(pathMapping).find(path => to.path.startsWith(path));
    if (matchedPath) {
        serviceType.value = pathMapping[matchedPath];
    } else {
        const queryServiceType = to.query.serviceType;
        const queryMapping = {
            'stays': 1,
            'transfers': 2,
            'cars': 3,
            'flights': 4,
            'assistances': 5,
            'circuits': 6
        };

        if (queryServiceType && queryMapping[queryServiceType]) {
            serviceType.value = queryMapping[queryServiceType];
        } else {
            serviceType.value = serviceType.value || 1;
        }
    }
}

function handleMiddleClick(event, serviceTypeId) {
    if (event.button === 1) {
        const url = getServiceUrl(serviceTypeId);
        window.open(url, '_blank');
    }
}

function getServiceUrl(serviceTypeId) {
    switch(serviceTypeId) {
        case 1: return "/?serviceType=stays";
        case 2: return "/?serviceType=transfers";
        case 3: return "/?serviceType=cars";
        case 4: return "/?serviceType=flights";
        case 5: return "/?serviceType=assistances";
        case 6: return "/?serviceType=circuits";
        default: return "/"; 
    }
}

function goToEbookingOld(service) {
    window.open("https://www.ebooking.com.ar/#/"+service, "_blank");
    serviceType.value = 1
}

onMounted(() => {
    updateServiceType(route);
});

onBeforeRouteUpdate((to, from) => {
    updateServiceType(to);
});

</script>

<style scoped>
.ease {
    transition: all 0.3s ease
}

.search-container {
    max-width: 1250px !important;
    margin: 0 auto;
}

.search-container-compact {
    text-align: left;
    margin: auto;
    padding: 0 !important
}

.search-tab {
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 24px 24px 0 0;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.1, 0.8, 1, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}

.grow {
    transition: all .2s ease-in-out;
}

.grow:hover {
    transform: scale(1.05);
}

.service-tabs-mobile {
    --v-tabs-height: 54px !important;
}

.service-tab {
    min-width: 100px;
}

.service-tab-mobile {
    min-width: 45px;
    padding: 12px !important
}

.v-slide-group-item--active {
    transition: all .2s ease-in-out;
    transform: scale(1.05)
}

.v-tabs--density-compact {
    height: 100%;
}

.v-tab.v-tab {
    min-width: 60px;
}

.service-selected {
    border-width: 2px;
}
</style>
