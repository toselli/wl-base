export const useUsersStore = defineStore("users", () => {
    const { initializeUserConfig } = useUserConfig();
    //state
    const loggedUser = ref(null)
    const anonymousUser = ref(null)
    const users = ref([])
    //getters
    const getLoggedUser = computed(() => loggedUser.value)
    const isLoggedIn = computed(() => loggedUser.value != null)
    const getAnonymousUser = computed(() => anonymousUser.value)

    const getUsers = computed(() => users.value)
    //actions
    function fetchLoggedUser() {
        return new Promise((resolve, reject) => {
            useIdentity.get('v1/users/me')
                .then((res: any) => {
                    loggedUser.value = res
                    if (!isLoggedIn.value) return reject(res);
                    initializeUserConfig(loggedUser.value.IdString)
                    resolve(res)
                }, err => {
                    reject(err)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    function fetchAnonymousUser() {
        const anonymousToken = useCookie('anonymousToken').value
        return new Promise((resolve, reject) => {
            let header = {
                Authorization: 'Bearer ' +anonymousToken
            }
            useIdentity.get('v1/users/me', header)
                .then((res: any) => {
                    anonymousUser.value = res
                    if (!isLoggedIn.value) return reject(res);
                    resolve(res)
                }, err => {
                    reject(err)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    function getUsersByRole() {
        return new Promise((resolve, reject) => {
            useIdentity.get("v1/users", null, {
                Page: 1,
                PageSize: 50,
            })
                .then((res) => {
                    users.value = res
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    // function getSellers() {
    //     return new Promise((resolve, reject) => {
    //         useIdentity.get("v1/users/sellers", null, {
    //                 Page: 1,
    //                 PageSize: 50,
    //                 Roles: 'SellersStaff',
    //         })
    //             .then((res) => {
    //                 users.value = res
    //                resolve(res)
    //             })
    //             .catch((err) => {
    //                 reject(err)
    //             })
    //     })
    // }

    function fetchSellers(payload: object) {
        return new Promise((resolve, reject) => {
            useEbooking.get("users/getUsersByAgencyCustomer", null, payload)
                .then((res) => {
                    users.value = res
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    function fetchSellersFlights(payload: object) {
        return new Promise((resolve, reject) => {
            useEbooking.get("users/getSellersByAgency", null, payload)
                .then((res) => {
                    users.value = res
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    function changePassword(payload: object) {
        return new Promise((resolve, reject) => {
            useIdentity.put(`v1/users/${payload.UserId}/reset-password`, null, payload)
                .then((res: any) => {
                    resolve(res)
                }, err => {
                    reject(err)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    function validateEmailforReset(payload: string) {
        return new Promise((resolve, reject) => {
            useIdentity.get(`v1/users/${payload}/validity-email`)
                .then((res: any) => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    return { loggedUser, getLoggedUser, getAnonymousUser, isLoggedIn, getUsers, fetchLoggedUser, fetchAnonymousUser, getUsersByRole, fetchSellers, fetchSellersFlights, changePassword, validateEmailforReset }
})