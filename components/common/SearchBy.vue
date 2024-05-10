
<template>
    <div class="d-flex align-center justify-center">
        <span class="text-secondary_text body-3">Search by</span>
        <EbookingLogo width="70" height="21" class="mt-2" v-if="theme.name == 'ThemeLight'" />
        <EbookingLogo width="70" height="21" class="mt-2" :dark="true" v-else />
    </div>
</template>
<script setup>
import { useTheme } from 'vuetify/framework';
const theme = ref(useTheme())

</script>