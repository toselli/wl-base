<template>
    <stays-checkout-price-card :services="services" :price="price" :retail="retail" v-if="serviceType == 'stays'"></stays-checkout-price-card>
    <transfers-checkout-price-card :services="services" :price="price" :retail="retail" v-if="serviceType == 'transfers'"></transfers-checkout-price-card>
    <cars-checkout-price-card :services="services" :price="price" :retail="retail" v-if="serviceType == 'cars'"></cars-checkout-price-card>
    <flights-checkout-price-card :services="services" :price="price" :retail="retail" v-if="serviceType == 'flights'"></flights-checkout-price-card>
    <assistances-checkout-price-card :services="services" :price="price" :retail="retail" v-if="serviceType == 'assistances'"></assistances-checkout-price-card>
    <circuits-checkout-price-card :services="services" :price="price" :retail="retail" v-if="serviceType == 'circuits'"></circuits-checkout-price-card>
</template>

<script setup>
const props = defineProps(['services','price','serviceType','retail','compact']);
</script>
