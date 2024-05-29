<template>
  <div>
    <CommonSearch class="mt-3" />
    <v-container class="content-container">
      <v-row>
        <v-col cols="12">
          <HomeNews />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <HomeToursOnHome />
        </v-col>
      </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <HomeExchanges />
          </v-col>
          <v-col cols="12" md="8">
            <HomeEmergencyLines />
          </v-col>
        </v-row>
    </v-container>
  </div>
</template>

<script setup>

//MOBILE
const isMobile = useMobile();

</script>

<style>
.search-tab {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 24px 24px 0 0;
}
</style>
