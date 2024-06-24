<template>
    <v-card flat rounded="lg" class="list-result-card fill-height" :id="service.Id">
        <v-row dense no-gutters >
            <v-col cols="12">
             
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>

const props = defineProps(['services'])
const service = props.services[0]
const mode = 'list' 

</script>