<template>
    <v-container class="content-container">
        <v-row dense>
            <v-col>
                <v-btn prepend-icon="mdi-chevron-left" rounded="xl" density="comfortable" variant="outlined" class="mt-3" @click="backToHome">
                    Volver</v-btn>
            </v-col>
            <v-col cols="12">
                <h3 class="text-h3 mt-1">{{route.params.tag}}</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-progress-circular indeterminate v-if="loading" class="mx-auto my-16"></v-progress-circular>
            <v-col cols="3" v-for="post in getPostsCategory" :key="post">
                        <PostsTourCard :post="post" class="ma-2" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
//MOBILE
const isMobile = useMobile()

const store = usePostsStore()
const loading = ref(false)
const posts = ref([])
async function fetchPosts() {
    try {
        loading.value = true
        await useNuxtApp().$toast.promise(store.fetchPosts, {
            error: 'Error al obtener los datos'
        })
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

watchEffect(() => {
    posts.value = store.getPosts;
});

const getPostsCategory = computed(() => {
    return posts.value.filter((post) => post.tag.name === route.params.tag);
}
);

function backToHome() {
    navigateTo('/')
}

const { toTop } = useScroll();

onMounted(() => {
   toTop()
   fetchPosts()
});


</script>
