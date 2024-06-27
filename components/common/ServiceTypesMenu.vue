<template>
    <div>
        <v-btn color="secondary"  variant="flat" class="bg-secondary_lighten text-secondary_darken justify-space-between  body-1  semi service-types-btn" rounded="md"
            id="menu-activator">
            <template v-slot:prepend>
                <v-icon :icon="getServiceType.icon"></v-icon>
            </template>
            <span v-if="!isMobile">{{ getServiceType.name }}</span>
            <template v-slot:append>
                <v-icon icon="md:keyboard_arrow_down" class="mr-2"></v-icon>
            </template>
        </v-btn>
        <v-menu v-if="getServiceTypes" activator="#menu-activator">
            <v-list flat elevation="1" :items="getServiceTypes">
                <v-list-subheader class="body-2 my-n3 text-primary_text justify-start ">
                    Explorar más servicios
                </v-list-subheader>
                <v-list-item class="body-1 pa-2 my-2 semi text-primary_text justify-start" 
                @click="item.oldUrl ? goToEbookingOld(item.oldUrl) : goTo(item)"
                    v-for="(item, index) in getServiceTypes" :key="index">
                    <v-btn style="max-width: 100%; width: 100%; min-width: 100%"
                        :variant="item.serviceType == getServiceType.serviceType ? 'outlined' : 'flat'"
                        :class="item.serviceType == getServiceType.serviceType ? 'bg-secondary_lighten text-secondary_darken' : 'text-secondary_text'"
                        class="body-1 semi justify-start" rounded="md" :prepend-icon="item.icon">
                        <span>{{ item.name }}</span>
                    </v-btn>
                </v-list-item>
            </v-list>

        </v-menu>
    </div>
</template>

<script setup>
const isMobile = useMobile()
const web = useWebStore()
const { getServiceTypes, getServiceType } = storeToRefs(web)
const serviceType = ref({})

watch(web.serviceType, () => {
    serviceType.value = getServiceType
})

const goTo = (service) => {
    const route = useRoute();
    
    navigateTo({
        path: "/",
        query: { serviceType: getServiceUrl(service.serviceType) },

    }, { 
    });
}
function getServiceUrl(serviceTypeId) {
    switch(serviceTypeId) {
        case 1: return "stays";
        case 2: return "transfers";
        case 3: return "cars";
        case 4: return "flights";
        case 5: return "assistances";
        case 6: return "circuits";
        case 7: return "sightseeing";
        default: return "/"; 
    }
}

function goToEbookingOld(service) {
    window.open("https://www.ebooking.com.ar/#/"+service, "_blank");
}

onMounted(() => {
    serviceType.value = getServiceType
})
</script>

<style >
.service-types-btn {
    padding: 0px 16px 0px 16px !important;
    height: 40px;
    width: 178px !important;
}
@media (min-width: 350px) {
    .service-types-btn {
        width: auto !important;
        margin-left: 12px;
        padding: 4px 4px 4px 16px !important;
    }

}
</style>