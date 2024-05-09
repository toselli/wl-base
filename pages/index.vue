<template>
  <CommonSearch class="mt-3" alignTabs="left" />
  <v-container class="content-container">
    <v-row>
      <v-col cols="12">
          <HomeNews />
      </v-col>
    </v-row>
  </v-container>
  <v-container class="content-container">
            <v-row v-if="posts && posts.length > 0">
                <v-col cols="12" md="2">
                    <h6 class="body-1 text-secondary_text mt-6">Paquetes vacacionales</h6>
                    <h3 class="text-h3 mt-1">Estas son nuestras ofertas del mes</h3>
                    <v-btn rounded="xl" variant="flat" color="primary" append-icon="mdi-chevron-right" class="mt-3"
                        @click="viewPostCategory('Paquetes%20%2f%20Ofertas')">Ver todos</v-btn>
                </v-col>
                <!-- <v-col cols="12" md="10">
                    <v-slide-group :show-arrows="!isMobile">
                        <v-slide-group-item v-for="post in getToursPost" :key="post">
                            <PostsTourCard :post="post" class="ma-2" />
                        </v-slide-group-item>
                    </v-slide-group>
                </v-col> -->
                <v-col cols="12" md="10">
                    <v-carousel height="320" show-arrows="hover" hide-delimiters progress="primary" v-if="isMobile">
                        <v-carousel-item v-for="(post, index) in getToursPost" :key="index">
                            <v-row dense class="mt-2">
                                <v-col cols="12">
                                    <PostsTourCard :post="post" />
                                </v-col>
                            </v-row>
                        </v-carousel-item>
                    </v-carousel>
                    <v-carousel height="320" show-arrows="hover" hide-delimiters progress="primary" v-else>
                        <v-carousel-item v-for="(chunk, index) in chunkedToursPosts" :key="index">
                            <v-row dense class="mt-2">
                                <v-col cols="12" md="4" v-for="post in chunk" :key="post.id">
                                    <PostsTourCard :post="post" />
                                </v-col>
                            </v-row>
                        </v-carousel-item>
                    </v-carousel>
                </v-col>
            </v-row>
            <v-row v-if="posts && posts.length > 0">
                <v-col cols="12">
                    <h6 class="body-1 text-secondary_text mt-6">Destinos recomendados</h6>
                    <h3 class="text-h3 mt-1">Descubrí estos lugares con nosotros</h3>
                </v-col>
                <v-col v-for="post in getDestinationPost" :key="post" cols="12">
                    <posts-destination-card :post="post" class="ma-1" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <contact-form-card /> </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card rounded="xl">
                        <v-card-text class="pa-8">
                            <h2 class="text-h2 mb-4">¡Conocenos mejor!</h2>
                            <v-row>
                                <v-col cols="12" lg="6">
                                    <p class="body-1 text-justify mb-1">
                                        Somos una operadora joven, que nació en 2018, con la misión de ofrecer al mercado
                                        una forma
                                        de hacer negocios diferente, totalmente transparente y confiable. La visión de Match
                                        S.A. es
                                        transformarse en el socio estratégico comercial de las agencias de viajes en
                                        Paraguay y la
                                        región, basándose en su grupo humano, con una marcada orientación al servicio,
                                        aportando
                                        soluciones tecnológicas y mirando siempre los detalles de cada viaje.
                                    </p>
                                    <p class="body-1 text-justify mb-1"> 
                                        Parte del grupo KMC – noviembre 2023.
                                    </p>
                                </v-col>
                                <v-col class="text-center">
                                    <CommonLogoLight :height="80" />
                                </v-col>
                            </v-row>

                        </v-card-text>
                    </v-card>

                </v-col>
            </v-row>
        </v-container>
</template>

<script setup>

</script>
