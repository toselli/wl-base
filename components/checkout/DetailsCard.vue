<template>
    <stays-checkout-details-card :services="booking.Services" :details="booking.Property" :compact="true" v-if="serviceType == 'stays'"></stays-checkout-details-card>
    <transfers-checkout-details-card :services="booking.Services" :compact="true" v-if="serviceType == 'transfers'"></transfers-checkout-details-card>
    <cars-checkout-details-card :services="booking.Services" :compact="true" v-if="serviceType == 'cars'"></cars-checkout-details-card>
    <flights-checkout-details-card :services="booking.Services" :compact="true" v-if="serviceType == 'flights'"></flights-checkout-details-card>
    <assistances-checkout-details-card :services="booking.Services" :compact="true" v-if="serviceType == 'assistances'"></assistances-checkout-details-card>
    <circuits-checkout-details-card :services="booking.Services" :compact="true" v-if="serviceType == 'circuits'"></circuits-checkout-details-card>
</template>

<script setup>
const props = defineProps(["booking","serviceType","services"]);

</script>
