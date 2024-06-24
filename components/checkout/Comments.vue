<template>
  <v-card rounded="lg" class="card-checkout-forms-content pa-4">
    <h3 class="text-h6 semi mb-4 pa-3 pa-md-0">Peticiones especiales</h3>
    <v-textarea label="Observaciones sólo indicativas, no están garantizadas" variant="outlined" v-model="commentsModel">
    </v-textarea>
  </v-card>
</template>

<script setup>
const props = defineProps(["comments"]);
const commentsModel = ref('')

watch(commentsModel, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      emitComments(newValue); 
    }
});

const emit = defineEmits(['update:comments'])

const emitComments = (value) => {
    emit('update:comments', value);
};
</script>
