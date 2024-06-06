<template>
  <v-dialog v-model="show" width="600px" radius="xl">
        <common-card-creation @confirmCardData="saveCard" />   

    </v-dialog>
</template>

<script setup>
const props = defineProps({
        modelValue: {
                type: Boolean,
                required: true
        }
});
const show = ref(false);

watchEffect(() => {
  show.value = props.modelValue;
});

watch(show, (newValue, oldValue) => {
  if (newValue === false && oldValue === true) {
    emit('close');
  }
});

const emit = defineEmits(['update:modelValue','close','save']);

function saveCard(data){
  emit('update:selectedPayment', data);
}
</script>
