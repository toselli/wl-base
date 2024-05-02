export const useLoginLegacyStore = defineStore("loginLegacy", () => {
    //state
    const loggedIn = ref(false)
    const expired = ref(false)

    //getters
    const isLoggedIn = computed(() => loggedIn.value)
    const isExpired = computed(() => expired.value)

    //actions
    function login(payload: any) {
        return new Promise((resolve, reject) => {
            const apiHeaders = {}
            useEbooking.post('account/token', apiHeaders, payload).then(
                (result: any) => {
                    if (result.status == 204) {
                        return reject(result)
                    }
                    let securityToken = useCookie('SECURITYTOKEN', { path: '/', secure: true })
                    securityToken.value = result.Token
                    loggedIn.value = true
                    resolve('Logging in...')
                },
                error => {
                    reject(error)
                    logout()
                }
            )
                .catch(err => {
                    reject(err)
                    logout()
                })
        })
    }

    function logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            let token = useCookie('SECURITYTOKEN')
            token.value = null
            loggedIn.value = false
            resolve()
        })
    }

    return { loggedIn, expired, isLoggedIn, isExpired, login, logout };

})
