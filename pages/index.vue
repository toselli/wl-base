<template>
  <div>
    <div class="hero pa-5">
      <CommonSearch class="mt-3" align="left"  />
    </div>
    <v-container class="content-container">
             <v-row>
          <v-col cols="12" lg="4">
            <HomeExchanges />
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
