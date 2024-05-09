<template>
    <v-card flat class="bg-foreground pa-0" rounded="lg">
        <v-card-title class="semi pb-0 ">
            Líneas de emergencia para llamadas y/o mensajes
        </v-card-title>
        <v-card-subtitle class="pt-0 text-secondary_text  " style="opacity: 100;">
            Por favor, enviar mensaje para saber cuál es la línea activa en esta semana
        </v-card-subtitle>
        <v-card-text class="body-1" :class="!isMobile ? 'd-flex align-center' : ''">
            Whatsapp: 
            <v-chip class="ml-1 mb-1 bg-background semi body-1 pa-2"  v-for="phone in getWebsite.EmergencyPhones" rounded="sm">
                <v-icon class="mr-1" size="18">mdi-phone</v-icon>
                {{ parse(phone.Value) }}
            </v-chip>
        </v-card-text>
        <v-card-subtitle class="legend pb-3  ">
            Línea <b>exclusiva</b> para <b>agencias</b> y por <b>pax en tránsito</b>.
        </v-card-subtitle>
    </v-card>
</template>

<script setup>
const isMobile = useMobile()
const webstore = useWebStore();
const { fetchWebsite } = webstore;
const { getWebsite } = webstore

const parse = (phone) => {
    const parsed = `${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8, 10)}`
    return parsed;
}

onMounted(() => {
    fetchWebsite()
})
</script>

<style scoped>
.legend {
    opacity: 100% !important;
}
</style>