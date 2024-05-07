<template>
    <v-dialog v-model="show" width="400px">
        <v-card rounded="xl">
            <v-card-text>
                <h3 class="text-h5 text-center my-6">Cambiar contraseña</h3>
                <v-form @submit.prevent="changePassword" v-model="valid">
                    <v-text-field label="Contraseña actual" color="secondary" prepend-inner-icon="mdi-lock-outline"
                        variant="outlined" :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showPass = !showPass" v-model="payload.OldPassword"
                        :type="showPass ? 'text' : 'password'" :rules="oldPasswordRules" class="mb-2"></v-text-field>
                    <v-text-field label="Nueva contraseña" color="secondary" prepend-inner-icon="mdi-lock-outline"
                        variant="outlined" :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showPass = !showPass" v-model="payload.Password"
                        :type="showPass ? 'text' : 'password'" :rules="passwordRules" class="mb-2"></v-text-field>
                    <v-text-field label="Confirmar nueva contraseña" color="secondary" prepend-inner-icon="mdi-lock-outline"
                        variant="outlined" :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showPass = !showPass" v-model="passwordConfirm"
                        :type="showPass ? 'text' : 'password'" :rules="passwordConfirmRules()" class="mb-2"></v-text-field>
                    <v-btn type="submit" block color="primary" rounded="xl" variant="flat" :disabled="!valid || loading"
                        :loading="loading">
                        Cambiar
                    </v-btn>
                    <p class="body-2 text-error text-center mt-4" v-if="errorMessage != ''">{{ $t(errorMessage) }}</p>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>

const usersStore = useUsersStore();
const { getLoggedUser } = storeToRefs(usersStore);

const payload = ref({
    UserId: null,
    OldPassword: '',
    Password: ''
})
const passwordConfirm = ref('')
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    compact: {
        type: Boolean,
        required: false,
        default: false
    }
});

const valid = ref(false);

const getPasswordValue = () => payload.value.Password;

const { oldPasswordRules, passwordRules, passwordConfirmRules }  = useFormRules(getPasswordValue);


const showPass = ref(false)
const show = ref(false);

watchEffect(() => {
    show.value = props.modelValue;
});

watch(show, (newValue, oldValue) => {
    if (newValue === false && oldValue === true) {
        emit('close');
    }
});

const errorMessage = ref('')
const loading = ref(false);
const changePassword = async () => {
    payload.value.UserId = getLoggedUser.value.Id
    loading.value = true
    try {
        await useNuxtApp().$toast.promise(usersStore.changePassword(payload.value), {
            pending: "Cambiando contraseña...",
            success: "Contraseña actualizaca con éxito",
            error: "Error al intentar actualizar",
        })
            .then((res) => {
                loading.value = false
                emit('close');
            })
            .catch((error) => {
                loading.value = false
                errorMessage.value = error.data
            })
    } catch (error) {

    } finally { }

}

const emit = defineEmits(['update:modelValue']);
</script>
