import { LoginResponse } from "~~/interfaces/identity/LoginResponse";
import { LoginRequest } from "~~/interfaces/identity/LoginRequest";
import { AuthError } from "~~/interfaces/identity/AuthError";


export function useAuth() {
    const loginStore = useLoginStore();
    const usersStore = useUsersStore();
    const loading = ref<boolean>(false);
    const errorMessage = ref<string>('');
    const isAuthorized = ref<boolean>(false);
    const hasPhoneNumber = ref<boolean>(false);
    const hasNoPhoneNumber = ref<boolean>(false);
    const phoneNumber = ref<string>('');
    const firstName = ref<string>('');
    const userValidated = ref<string>('');

    const isExpired = computed(() =>
        loginStore.isExpired
    )

    async function login(payload: LoginRequest): Promise<void> {
        loading.value = true;
        errorMessage.value = '';
        try {
            const response: LoginResponse = await loginStore.login(payload);
            if (response.IsAuthorized) {
                isAuthorized.value = true;
                await usersStore.fetchLoggedUser();
            } else if (response.PhoneNumber) {
                hasPhoneNumber.value = true;
                phoneNumber.value = response.PhoneNumber
                firstName.value = response.FirstName
                sendToken(response.PhoneNumber)
            } else {
                hasNoPhoneNumber.value = true;
            }
        } catch (error) {
            console.log(error)
            if(error.data) {
                errorMessage.value = error.data
            } else {
                errorMessage.value = 'Error durante el proceso de autenticación. Por favor, intenta nuevamente.';
            }
            
        } finally {
            loading.value = false;
        }
    }

    async function sendToken(phoneNumber: string): Promise<void> {
        loading.value = true;
        errorMessage.value = '';

        try {
            const payload = { phoneNumber };
            await loginStore.sendToken(payload);
            // Manejo exitoso del envío de token
        } catch (error) {
            const e = error as AuthError;
            errorMessage.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function verifyToken(payload: object): Promise<void> {
        loading.value = true;
        errorMessage.value = '';
        try {
            const response: LoginResponse = await loginStore.verifyToken(payload);
            if (response.isAuthorized) {
                isAuthorized.value = true;
                await useNuxtApp().$toast.promise(
                    usersStore.fetchLoggedUser(), {
                    pending: "Ingresando...",
                    success: "Autenticación exitosa",
                    error: "Por favor verifique el código de uso único ingresado.",
                })
            } else {
                errorMessage.value = 'Por favor verifique el código de uso único ingresado.';
            }
        } catch (error) {
            const e = error as AuthError;
            errorMessage.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function validateEmail(username: string): Promise<void> {
        loading.value = true
        errorMessage.value = ''
        try {
            await useNuxtApp().$toast.promise(usersStore.validateEmailforReset(username), {
                pending: "Solicitando validación...",
                success: "Validación procesada con éxito",
                error: "El email ingresado no corresponde a un usuario registrado",
            })
                .then((res) => {
                    loading.value = false
                    userValidated.value = res
                })
        } catch (error) {
            loading.value = false
            const e = error as AuthError;
            errorMessage.value = e.message;
        } finally { }

    }

    async function restorePassword(payload: { id: string, email: string, newPassword: string, token: string }): Promise<void> {
        loading.value = true;
        errorMessage.value = '';
        try {
            await useNuxtApp().$toast.promise(usersStore.changePassword(payload), {
                pending: "Actualizando credenciales...",
                success: "La contraseña fue actualizada con éxito. Ingrese con sus nuevas credenciales",
                error: "Ocurrió un error al actualizar contraseña intente nuevamente",
            })
            loading.value = false;
            // Manejo exitoso de la restauración de la contraseña
        } catch (error) {
            const e = error as AuthError;
            errorMessage.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function logout(): Promise<void> {
        loading.value = true;
        errorMessage.value = '';

        try {
            await loginStore.logout();
            // Aquí puedes añadir cualquier lógica adicional necesaria tras el logout,
            // como limpiar el estado del usuario en la aplicación o redireccionar a la página de inicio
        } catch (error) {
            const e = error as AuthError;
            errorMessage.value = e.message;
            // Manejo de errores durante el proceso de logout
        } finally {
            loading.value = false;
            // Asegúrate de restablecer cualquier estado relevante en tu aplicación aquí
        }
    }

    return {
        loading,
        errorMessage,
        isAuthorized,
        hasPhoneNumber,
        hasNoPhoneNumber,
        phoneNumber,
        isExpired,
        firstName,
        userValidated,
        login,
        logout,
        sendToken,
        verifyToken,
        validateEmail,
        restorePassword,
    };
}