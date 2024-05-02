<template>
    <v-dialog v-model="show" width="480px" :persistent="!loginForm">
        <v-card rounded="xl">
            <v-card-text v-if="loginForm">
                <h3 class="text-h5 text-center my-6">Inicie sesión con sus datos</h3>
                <v-form @submit.prevent="handleLogin" novalidate>
                    <v-text-field label="Email" color="secondary" prepend-inner-icon="mdi-email" variant="outlined"
                        v-model="loginData.username" :rules="userRules" class="mb-2"></v-text-field>
                    <v-text-field :label="$capitalize($t('password'))" color="secondary"
                        prepend-inner-icon="mdi-lock-outline" variant="outlined"
                        :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="showPass = !showPass"
                        v-model="loginData.password" :type="showPass ? 'text' : 'password'" :rules="passwordRules"
                        class="mb-2"></v-text-field>
                    <v-btn type="submit" block color="primary" rounded="xl" flat
                        :disabled="!loginData.password || loading" :loading="loading">
                        Ingresar
                    </v-btn>
                    <p class="body-2 text-error text-center mt-4">{{ $t(errorMessage) }}</p>
                </v-form>
                <v-divider class="my-4"></v-divider>
                <v-btn type="submit" block color="secondary" rounded="xl" variant="text"
                    @click="validateForm = true; loginForm = false">¿Olvidaste tu contraseña?</v-btn>
            </v-card-text>
            <v-card-text v-else>
                <div v-if="validateForm">
                    <h3 class="text-h5 text-center mt-6 mb-3">{{ $t('restore_password') }}</h3>
                    <v-form v-model="validForgot" v-on:submit.prevent="handleValidateEmail">
                        <v-card-text>
                            <p class="mb-4">{{ $t('type_email') }}</p>
                            <v-text-field label="Email" v-model="loginData.username" prepend-inner-icon="mdi-email"
                                :rules="emailRules" name="email" type="text" variant="outlined"
                                color="secondary"></v-text-field>
                        </v-card-text>
                        <v-row dense>
                            <v-col>
                                <v-btn block rounded="xl"  variant="flat" @click="loginForm = true; validateForm = false"
                                    :loading="loading">{{ $capitalize($t('cancel')) }}
                                </v-btn>
                            </v-col>
                            <v-col>
                                <v-btn block color="primary" :disabled="!validForgot" rounded="xl" flat
                                    :loading="loading" type="submit">{{ $capitalize($t('request')) }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </div>
                <div v-if="restoreForm">
                    <p class="body-1 text-center mt-6 mb-4">{{ $t('send_token_message') }}</p>
                    <p class="body-1 text-center mt-1 mb-4">{{ maskedEmail }}</p>
                    <v-form v-model="validRestore" v-on:submit.prevent="handleRestorePassword">
                        <p class="body-1 semi">{{ $t('input_token') }}</p>
                        <v-otp-input v-model="token" length="6" class="mt-3 mb-3"></v-otp-input>
                        <p class="body-1 semi mt-2 mb-3">{{ $t('restore_password_message') }}</p>
                        <v-text-field :label="$capitalize($t('new_password')) + ' *'" color="secondary"
                            prepend-inner-icon="mdi-lock-outline" variant="outlined"
                            :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules()"
                            @click:append-inner="showPass = !showPass" v-model="newPassword" counter
                            :type="showPass ? 'text' : 'password'" class="mb-2"></v-text-field>
                        <v-text-field :label="$capitalize($t('repeat_new_password')) + ' *'" color="secondary"
                            prepend-inner-icon="mdi-lock-outline" variant="outlined"
                            :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordConfirmRules()"
                            @click:append-inner="showPass = !showPass" v-model="passwordConfirm" counter
                            :type="showPass ? 'text' : 'password'" class="mb-2"></v-text-field>
                        <p class="body-2 text-error text-center mt-4">{{ $t(errorMessage) }}</p>
                        <v-row dense>
                            <v-col>
                                <v-btn block rounded="xl"  variant="flat"
                                    @click="loginForm = true; validateForm = false; restoreForm = false"
                                    :loading="loading">{{ $capitalize($t('cancel')) }}
                                </v-btn>
                            </v-col>
                            <v-col>
                                <v-btn block color="primary" :disabled="!validRestore || !isTokenValid" rounded="xl"
                                variant="flat" :loading="loading" type="submit">{{ $capitalize($t('request')) }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </div>
                <div v-if="otpForm">
                    <div class="body-1 mt-6 mb-4">
                        <p class="semi mb-2">¡Hola {{ firstName }}!</p>
                        <p class="mb-2">Para garantizar la seguridad de
                            nuestro sistema, necesitamos verificar que seas vos.</p>
                        <p>Recibirás un código de acceso al celular terminado en <span class="semi">{{
                            phoneNumber.slice(-4) }}</span></p>
                    </div>
                    <v-form v-model="validOtp" v-on:submit.prevent="handleVerifyToken">
                        <p class="body-1 semi">{{ $t('input_token') }}</p>
                        <v-otp-input v-model="otpToken" length="6" class="mt-3 mb-3" :loading="loading"
                            @finish="handleVerifyToken"></v-otp-input>
                        <p class="body-2 text-error text-center my-4">{{ $t(errorMessage) }}</p>
                        <v-row dense>
                            <v-col>
                                <v-btn block color="primary" :disabled="!isTokenOtpValid" rounded="xl" flat
                                    :loading="loading" type="submit">{{
                                        $capitalize($t('verify')) }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </div>
            </v-card-text>
        </v-card>
        <v-dialog v-model="noPhoneNumberDialog" width="450px">
            <v-card rounded="xl">
                <v-alert class="pa-8" color="error_lighten">
                    No tiene un número de móvil con Whatsapp asociado para que enviemos el código de uso único. <br>
                    <span class="semi">Debe comunicarse con un administrador del sistema.</span>
                </v-alert>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>

<script setup>

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

const newPassword = ref('')
const passwordConfirm = ref('')

const getPasswordValue = () => newPassword.value;

const { userRules, passwordRules, emailRules, passwordConfirmRules } = useFormRules(getPasswordValue);

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


const { loading, errorMessage, login, verifyToken, validateEmail, restorePassword, isAuthorized, hasPhoneNumber, hasNoPhoneNumber, phoneNumber, firstName, userValidated } = useAuth();
const loginData = ref({ username: '', password: '' });
const validForgot = ref(false)
const validateForm = ref(false)
const loginForm = ref(true)
const restoreForm = ref(false)
const otpForm = ref(false)
const noPhoneNumberDialog = ref(false)


const handleLogin = async () => {
    await login(loginData.value);
};

// watch(isExpired, (newValue) => {
//     show.value = true;
// })


// Reaccionar a cambios en `isAuthorized` para cerrar el diálogo o hacer otras acciones
watch(isAuthorized, (newValue) => {
    show.value = false
    loginForm.value = true
    restoreForm.value = false
    validateForm.value = false
    otpForm.value = false

});

// Manejar la lógica de hasPhoneNumber para mostrar UI adicional si es necesario
watch(hasPhoneNumber, (newValue) => {
    if (newValue) {
        otpForm.value = true
        restoreForm.value = false
        validateForm.value = false
        loginForm.value = false
    }
});

watch(hasNoPhoneNumber, (newValue) => {
    if (newValue) {
        noPhoneNumberDialog.value = true
    }
});

//TOKEN LOGIN

const otpToken = ref('')
const validOtp = ref(false)
const isTokenOtpValid = computed(() => otpToken.value.length >= 6);

const handleVerifyToken = async () => {
    let payload = loginData.value
    payload.token = otpToken.value
    await verifyToken(payload);
}

//RESTORE PASSWORD

const handleValidateEmail = async () => {
    await validateEmail(loginData.value.username);
}

watch(userValidated, (newValue) => {
    if (newValue) {
        otpForm.value = false
        restoreForm.value = true
        validateForm.value = false
        loginForm.value = false
    }
});

const token = ref('')
const isTokenValid = computed(() => token.value.length >= 6);

const maskedEmail = computed(() => {
    const parts = loginData.value.username.split('@');
    const user = parts[0].substring(0, 3) + '*'.repeat(parts[0].length - 3);
    const domain = parts[1].substring(0, 3) + '*'.repeat(parts[1].length - 3);
    return user + '@' + domain;
})

const validRestore = ref(false)

const handleRestorePassword = async () => {
    let payload = {
        id: userValidated.value,
        email: loginData.value.username,
        password: newPassword.value,
        token: token.value
    }
    await restorePassword(payload);
    token.value = ''
    loginData.value.password = newPassword.value
    newPassword.value = ''
    passwordConfirm.value = ''
    validateForm.value = false
    restoreForm.value = false
    loginForm.value = true
}

const emit = defineEmits(['update:modelValue']);
</script>
