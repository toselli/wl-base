<template>
  <div>
    <v-container class="content-container">
      <v-row>
        <v-col cols="12">
        <h1 class="text-center" v-for="(name, i) in shuffle(nombres)">
          {{ i+1 }} {{ name }}
        </h1>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>

//MOBILE
const nombres = ['Ethan', 'Chino', 'Patri', 'Luki', 'Mati', 'Gabi M'];

// Función para ordenar aleatoriamente la lista
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // Mientras queden elementos a mezclar
  while (currentIndex !== 0) {

    // Seleccionar un elemento sin mezclar restante
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Intercambiarlo con el elemento actual
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
</script>

<style>
.search-tab {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 24px 24px 0 0;
}
</style>
