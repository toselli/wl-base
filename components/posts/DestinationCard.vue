<template>
  <v-card class="tour-slide-card" flat rounded="lg" @click="viewPost()" theme="ThemeDark">
    <v-img :src="post.bannerUrl" class="rounded-lg pa-12" height="240px" cover> 
    <v-sheet color="transparent" width="250">
      <h4 class="text-h3 mt-2">{{ post.title }}</h4>
      <h6 class="text-h4 pa-3">{{ post.subtitle }}</h6>
      <v-btn theme="light" rounded="xl" variant="flat" density="compact">Ver más</v-btn>
</v-sheet>
    </v-img>
  </v-card>
</template>

<script setup>
const props = defineProps(["post"]);

function viewPost() {
  navigateTo({
        path: "/destination/"+props.post.id,
      })
}
</script>
