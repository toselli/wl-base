<template>
    <v-dialog v-model="show" width="400px">
        <v-card rounded="xl" class="bg-midground">
            <transition-group name="fade" mode="out-in">
                <v-card-text class="pa-4" v-show="step == 1">
                    <h3 class="text-h5 text-center my-6">Ingrese su email y cree una contraseña</h3>
                    <v-form>
                        <v-sheet rounded="lg" class="pa-4 bg-foreground mb-3">
                            <v-text-field label="Email" variant="outlined" density="compact"
                                v-model="newUser.name"></v-text-field>
                            <v-text-field label="Contraseña" variant="outlined" type="password" density="compact"
                                v-model="newUser.lastname"></v-text-field>
                            <v-text-field label="Confirmar Contraseña" variant="outlined" type="password" density="compact"
                                v-model="newUser.nationality"></v-text-field>
                        </v-sheet>
                        <v-btn block color="primary" rounded="xl" variant="flat" @click="step = 2">Crear cuenta</v-btn>
                    </v-form>
                </v-card-text>
                <v-card-text class="pa-4" v-show="step == 2">
                    <h3 class="text-h5 text-center my-6">Completa los datos de tu cuenta</h3>
                    <v-form>
                        <v-sheet rounded="lg" class="pa-4 bg-foreground mb-3">
                            <h4 class="mb-3">1. Datos personales</h4>
                            <v-text-field label="Nombre" variant="outlined" density="compact"
                                v-model="newUser.name"></v-text-field>
                            <v-text-field label="Apellido" variant="outlined" density="compact"
                                v-model="newUser.lastname"></v-text-field>
                            <v-text-field label="Nacionalidad" variant="outlined" density="compact"
                                v-model="newUser.nationality"></v-text-field>
                            <v-text-field label="Teléfono" variant="outlined" density="compact"
                                v-model="newUser.phone"></v-text-field>
                        </v-sheet>
                        <v-card-actions>
                            <v-container>
                                <v-row dense>
                                    <v-col> <v-btn block color="primary" rounded="xl" @click="step = 1"
                                            variant="tonal">Volver</v-btn>
                                    </v-col>
                                    <v-col>
                                        <v-btn block color="primary" rounded="xl" flat
                                            @click="step = 3">Continuar</v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>

                        </v-card-actions>
                    </v-form>
                </v-card-text>
                <v-card-text class="pa-4" v-show="step == 3">
                    <h3 class="text-h5 text-center my-6">Completa los datos de tu cuenta</h3>
                    <v-form>
                        <v-sheet rounded="lg" class="pa-4 bg-foreground mb-3">
                            <h4 class="mb-3">2. Datos de su agencia</h4>
                            <p class="body-2 mb-4">Ingrese N° de Identificación para validar la agencia</p>
                            <v-text-field label="N° de Identificación" variant="outlined" density="compact"
                                v-model="newUser.lastname"></v-text-field>
                        </v-sheet>

                    </v-form>
                    <v-card-actions>
                    <v-container>
                        <v-row dense>
                            <v-col> <v-btn block color="primary" rounded="xl" variant="tonal"
                                    @click="step = 2">Volver</v-btn>
                            </v-col>
                            <v-col>
                                <v-btn block color="primary" rounded="xl" flat @click="show = false">Confirmar</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>

                </v-card-actions>
                </v-card-text>
                
            </transition-group>
        </v-card>
    </v-dialog>
</template>
  
<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
});

const newUser = ref({
    name: '',
    lastname: '',
    nationality: '',
    phone: ''

})

const show = ref(false);


watchEffect(() => {
    show.value = props.modelValue;
});

watch(show, (newValue, oldValue) => {
    if (newValue === false && oldValue === true) {
        emit('close');
        step.value = 1
    }
});

const emit = defineEmits(['update:modelValue']);


const step = ref(1);

</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}</style>