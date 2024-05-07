<template>
    <v-no-ssr>
        <VueDatePicker class="search-timepicker" :class="compact ? '' : 'mt-2'" ref="dp" v-model="time"
            :auto-position="false" :teleport="true"
            :menu-class-name="isMobile ? 'search-timepicker-mobile' : 'search-timepicker-menu'"
            :alt-position="isMobile ? mobilePosition : null" :clearable="false" time-picker locale="es"
            minutes-increment="15" :dark="theme.name != 'ThemeLight'">
            <template #top-extra="{ value }">
                <h4 class="body-1 text-center py-2">Seleccione una hora</h4>
            </template>
            <template #action-buttons="{ value }">
                <v-btn variant="flat" rounded="md" color="secondary" block size="large" @click="selectTime"
                    :disabled="value == undefined">
                    {{ $capitalize($t("confirm")) }}</v-btn>
            </template>
            <template #dp-input="{ }">
                <v-btn class="btn-search-date" variant="tonal">
                    <v-icon icon="mdi-clock-outline" class="mr-2"></v-icon>
                    <span v-if="time">  {{ time.hours }}:{{ time.minutes < 10 ? '0' + time.minutes : time.minutes }} hs</span>
                        <span v-else class="text-secondary_text">Seleccionar hora</span>
                    </v-btn>
            </template>
        </VueDatePicker>
    </v-no-ssr>
</template>

<script setup>
import dayjs from "dayjs";
const isMobile = useMobile()

const props = defineProps(["compact", "searchedTime"]);
const emit = defineEmits(['update:selectedDate']);

import { useTheme } from 'vuetify/framework';
const theme = ref(useTheme())

const mobilePosition = () => ({ top: 0, left: 0 });
const desktopPosition = () => ({ top: 150, left: 450 });

const time = ref({ hours: 10, minutes: 0 });
const dp = ref();

const selectTime = () => {
    dp.value.selectDate();
    emit('update:selectedTime', time.value);
};

watch(() => props.searchedTime, (newDate, oldDate) => {
    if (newDate && newDate.length > 0) {
        time.value = newDate;
    }
}, { deep: true });

watch(() => time.value, () => {
    if (time.value) {
        emit('update:selectedTime', time.value);
    }
}, { deep: true });


</script>