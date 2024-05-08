<template>
  <div>
    <div class="hero d-flex align-center">
      <CommonSearch class="mt-3" alignTabs="left"  />
    </div>
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
