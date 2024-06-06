<template>
    <v-container fluid class="pa-0">
        <a :href="`https://www.juantoselli.com/#/web/paginas/64ccfcb2c80f94bc2b9cacc0/%F0%9F%9A%80-nuevos-lanzamientos`"
            target="_blank">
            <v-card heigth="200px" flat elevation="0" class="text-white card-gradient d-flex" rounded="lg">
                <v-row align="center" justify="center">
                    <v-col cols="12" class="pa-5 d-flex flex-column">
                        <v-card-title>
                            <h1 class="semi text-shade_light" style="font-size: 24px">Nuevos lanzamientos</h1>
                        </v-card-title>
                        <v-card-subtitle class="body-1 mb-1 mt-n1">
                            Todas las novedades en salidas grupales, cupos y más.
                        </v-card-subtitle>
                        <v-card-actions class="d-flex   pa-3 py-5">
                            <v-btn rounded="md" class="bg-white text-primary_text">
                                Descubrí lo nuevo
                            </v-btn>
                            <div class="logo-container">
                                <v-img height="30px" width="74px" src="/base/img/juan_toselli.png"></v-img>
                            </div>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-card>
        </a>
    </v-container>
</template>

<script setup>

</script>

<style scoped>
.card-gradient {
    background: url('/base/img/news.png'), linear-gradient(0deg, #121F3D 0%, #173782 100%);
    background-repeat: no-repeat;
    background-position: 100%;
}

.logo-container {
    align-self: end;
    width: 100% !important;
    position: absolute;
    left: 48%;
}
</style>