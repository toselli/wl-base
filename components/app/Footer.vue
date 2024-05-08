<template>
  <v-container fluid class="pa-0 mt-0">
    <v-card class="footer bg-secondary px-6 pb-6" theme="ThemeLight">
      <v-container class="pb-0">
        <v-row justify="center" class="pb-0" align="center">
          <v-col cols="12" md="3" class="pb-0 text-center text-md-left">
            <CommonLogoDark :height="50" />
          </v-col>
          <v-col cols="12" md="5" class="text-center">
            <v-img src="../img/footer_logos.png" ></v-img>
          </v-col>
          <v-col cols="12" md="3" class="text-center text-md-right">
            <v-btn href="https://www.instagram.com/360regionaltour/" target="_blank" icon="mdi-instagram" variant="text" color="white"> </v-btn>
            <v-btn href="https://www.facebook.com/people/360-REGIONAL-TOUR-OPERATOR/100064435760055/" target="_blank" variant="text" color="white" 
              icon="mdi-facebook"></v-btn>
            <v-btn
              href="https://api.whatsapp.com/send?phone=5493518112254&text=Quiero%20consultar%20sobre%20mi%20pr%C3%B3ximo%20viaje..." variant="text" color="white" 
              target="_blank" icon="mdi-whatsapp"> </v-btn>
              <v-btn
              href="https://twitter.com/360regionalok" variant="text" color="white" 
              target="_blank" icon="mdi-twitter"> </v-btn>
          </v-col>
          <v-col cols="12">
            <p class="body-1 mb-2 text-center">
              Marcelo T. de Alvear 368 Piso 1 Oficina 1 - Tel.: 0351-4215540 | WhatsApp: 351-8112254
            </p>
            <p class="body-1  text-center">
              <strong>360 Regional</strong> Tour Operador E.V.yT. - <strong>Licencia definitiva</strong>, Legajo 13960
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card class="bg-black pa-6" theme="ThemeLight" tile>
      <v-row>
        <v-col cols="12">
          <p class="body-2 text-white text-center mb-4">
            ©2024 - 360 Regional - Reservas online
          </p>
          <p class="body-2 text-white text-center mb-4 d-flex align-center justify-center">
            Developed by
            <CommonTplusDLogo width="100" height="14" :dark="true" class="mx-3" />
          </p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

