<template>
    <CommonSearch class="mt-3" alignTabs="left"  />
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
          <v-col cols="12" lg="4">
            <HomeExchanges />
          </v-col>
          <v-col>
            <HomeEmergencyLines />
          </v-col>
        </v-row>
    </v-container>
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
