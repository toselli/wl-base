import { LoginResponse } from "~~/interfaces/identity/LoginResponse";
import { LoginRequest } from "~~/interfaces/identity/LoginRequest";

export const useLoginStore = defineStore("login", () => {
    //state
    const loggedIn = ref(false)
    const expired = ref(false)
    //getters
    const isLoggedin = computed(() => loggedIn.value)
    const isExpired = computed(() => expired.value)

    //actions
    async function login(payload: LoginRequest): Promise<LoginResponse> {
        try {
            const apiHeaders = {};
            const res = await useIdentity.post<LoginResponse>('v1/accounts/login', apiHeaders, payload);
    
            loggedIn.value = true;
    
            const accessTokenCookie = useCookie('accessToken');
            accessTokenCookie.value = res.AccessToken;

            const securityTokenCookie = useCookie('SECURITYTOKEN', { path: '/', secure: true })
            securityTokenCookie.value = res.SecurityToken
    
            const refreshTokenCookie = useCookie('refreshToken');
            refreshTokenCookie.value = res.RefreshToken;
            return res;
        } catch (error) {
            logout();
            throw error;
        }
    };

    function sendToken(payload: any): Promise<LoginResponse> {
        return new Promise((resolve, reject) => {
            const apiHeaders = {}
            useCloudMessaging.post<LoginResponse>('v1/whatsapp/sendtoken', apiHeaders, payload)
                .then((res: LoginResponse) => {
                    resolve(res)
                }, error => {
                    reject(error)
                    logout()
                })
                .catch((error) => {
                    reject(error)
                    logout()
                })
        })
    };
    function verifyToken(payload: any): Promise<LoginResponse> {
        return new Promise((resolve, reject) => {
            const apiHeaders = {}
            useCloudMessaging.post<LoginResponse>(`v1/whatsapp/verifytoken/${payload.token}`, apiHeaders, payload)
                .then((res: LoginResponse) => {
                    if (res.isAuthorized) {
                        loggedIn.value = true;
                        const accessTokenCookie = useCookie('accessToken')
                        accessTokenCookie.value = res.accessToken;

                        const securityTokenCookie = useCookie('SECURITYTOKEN', { path: '/', secure: true })
                        securityTokenCookie.value = res.securityToken

                        const refreshTokenCookie = useCookie('refreshToken')
                        refreshTokenCookie.value = res.refreshToken;
                    }
                    resolve(res)
                }, error => {
                    reject(error)
                    logout()
                })
                .catch((error) => {
                    reject(error)
                    logout()
                })
        })
    };

    function logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            let accessToken = useCookie('accessToken')
            accessToken.value = null
            let refreshToken = useCookie('refreshToken')
            refreshToken.value = null
            let securityToken = useCookie('SECURITYTOKEN')
            securityToken.value = null

            loggedIn.value = false
            const userStore = useUsersStore()
            userStore.loggedUser = null

            resolve()
        })
    }

    function refresh(): Promise<void> {
        return new Promise((resolve, reject) => {
            const refreshToken = useCookie('refreshToken').value
            useIdentity.post<string>('v1/tokens/refresh', {"set-cookie": `refreshToken=${refreshToken};`})
                .then((newAccessToken: string) => {
                    useCookie('accessToken').value = newAccessToken;
                    resolve();
                })
                .catch(err => {
                    loggedIn.value = false;
                    reject(err)
                })
        })
    }

    return { isLoggedin, loggedIn, isExpired, login, logout, refresh, sendToken, verifyToken }

})