<template>
    <stays-checkout-policies-card :booking="booking" v-if="serviceType == 'stays'"></stays-checkout-policies-card>
    <transfers-checkout-policies-card :booking="booking" v-if="serviceType == 'transfers'"></transfers-checkout-policies-card>
    <cars-checkout-policies-card :booking="booking" v-if="serviceType == 'cars'"></cars-checkout-policies-card>
    <flights-checkout-policies-card :booking="booking" v-if="serviceType == 'flights'"></flights-checkout-policies-card>
    <assistances-checkout-policies-card :booking="booking" v-if="serviceType == 'assistances'"></assistances-checkout-policies-card>
    <circuits-checkout-policies-card :booking="booking" v-if="serviceType == 'circuits'"></circuits-checkout-policies-card>
</template>

<script setup>
const props = defineProps(["booking","serviceType"]);
</script>
