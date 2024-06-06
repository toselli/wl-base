import { LoginResponse } from "~~/interfaces/identity/LoginResponse";
import { LoginRequest } from "~~/interfaces/identity/LoginRequest";

export function useAnonymousLogin() {
    const loginStore = useLoginStore();
    const usersStore = useUsersStore();
    const loading = ref<boolean>(false);
    const errorMessage = ref<string>('');
    const isAuthorized = ref<boolean>(false);
    const userValidated = ref<string>('');

    async function anonymousLogin(): Promise<void> {
        loading.value = true;
        errorMessage.value = '';
        let payload = {
          username: "anonimo@letmetravel.com.ar",
          password: "Anonimo1234",
          anonymous:true
      }
        try {
            const response: LoginResponse = await loginStore.anonymousLogin(payload);
            if (response.IsAuthorized) {
                isAuthorized.value = true;
                await usersStore.fetchAnonymousUser();
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

    async function anonymousLogout(): Promise<void> {
        loading.value = true;
        errorMessage.value = '';

        try {
            await loginStore.logout();
        } catch (error) {
            const e = error as AuthError;
            errorMessage.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        errorMessage,
        isAuthorized,
        userValidated,
        anonymousLogin,
        anonymousLogout
    };
}