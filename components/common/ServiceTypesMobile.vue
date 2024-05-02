<template>
    <div>
        <v-btn color="secondary"  variant="flat" class="bg-secondary_lighten text-secondary 
        justify-space-between  body-1  semi service-types-btn" rounded="md"
            id="menu-activator" append-icon="md:keyboard_arrow_down">
            <template v-slot:prepend>
                <v-icon :icon="serviceType.icon" class="mr-2"></v-icon>
                <span>{{ serviceType.name }}</span>
            </template>
        </v-btn>
        <v-menu v-if="getServiceTypes" activator="#menu-activator">
            <v-list flat elevation="1" :items="getServiceTypes">
                <v-list-subheader class="body-2 my-n3 text-primary_text justify-start ">
                    Buscar más servicios
                </v-list-subheader>
                <v-list-item class="body-1 pa-2 my-2 semi text-primary_text justify-start" @click="goTo(item)"
                    v-for="(item, index) in getServiceTypes" :key="index">
                    <v-btn style="max-width: 100%; width: 100%; min-width: 100%"
                        :variant="item.serviceType == serviceType ? 'outlined' : 'flat'"
                        :class="item.serviceType == serviceType ? 'bg-secondary_lighten text-secondary_darken' : 'text-secondary_text'"
                        class="body-1 semi justify-start" rounded="md" :prepend-icon="item.icon">
                        <span>{{ item.name }}</span>
                    </v-btn>
                </v-list-item>
                <v-list-item class="body-1 pa-2 my-2 semi text-primary_text justify-start" @click="goToEbookingOld()">
                    <v-btn style="max-width: 100%; width: 100%; min-width: 100%"
                        flat
                        class="text-secondary_text body-1 semi justify-start" rounded="md" prepend-icon="mdi-plus">
                        <span>Otros servicios</span>
                    </v-btn>
                </v-list-item>
            </v-list>

        </v-menu>
    </div>
</template>

<script setup>
const web = useWebStore()
const { getServiceTypes } = storeToRefs(web)
const serviceType = ref({
        serviceType: 1,
        ebookingServiceType: 0,
        code: "stays",
        name: "Alojamientos",
        icon: "md:hotel"
    })

const goTo = (service) => {
    const route = useRoute();
    serviceType.value = service
    navigateTo({
        path: "/",
        query: { serviceType: service.serviceType },

    }, { 
    });
}

function goToEbookingOld() {
    window.open("https://www.ebooking.com.ar/#/", "_blank");
}

</script>

<style >
.service-types-btn {
    padding: 0px 8px 0px 16px !important;
    height: 40px;
    width: 167px !important;
}
</style>