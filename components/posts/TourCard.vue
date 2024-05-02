<template>
  <v-card class="tour-slide-card pb-2" rounded="lg" flat width="100%" @click="viewPost()"
    @click.middle.prevent="viewPostNewTab()">
    <v-img :src="post.bannerUrl" class="rounded-lg" height="200px" cover> </v-img>
    <v-chip size="small" :color="tagColor.getTagColor(post.tag.id)" variant="tonal" v-if="post.tag" class="mt-2">{{
      post.tag.name }}</v-chip>
    <h4 class="text-h6 semi pt-2 px-2">{{ post.title }}</h4>

  </v-card>
</template>

<script setup>
const props = defineProps(["post"]);

function viewPost() {
  navigateTo({
    path: "/post/" + props.post.id,
  })
}

function viewPostNewTab() {
  navigateTo({
    path: "/post/" + props.post.id,
    open: {
      target: '_blank'
    }
  })
}

const tagColor = useTagColor();

</script>
