import useQueryBuilder from "./useQueryBuilder"

export const useIdentity = {
    async post<T>(endpoint: string, headers: any = null, body: any = null): Promise<T> {
        const accessToken = useCookie('accessToken').value
        const refreshToken = useCookie('refreshToken').value

        if(accessToken)
        headers = Object.assign({ 'accessToken': accessToken }, headers)
        
        const nuxtConfig = useRuntimeConfig()
        const result = await $fetch(useQueryBuilder(nuxtConfig.public.identityApi, endpoint), {
            method: 'POST',
            body: body,
            headers: headers
        })
        return <T>result;
    },
    async get(endpoint: string, headers: any = null, params: any = null) {
        const accessToken = useCookie('accessToken').value
        if (accessToken) {
            const bearer = `Bearer ${accessToken}`
            if (headers) {
                headers["Authorization"] = bearer
            }
            else {
                headers = { Authorization: bearer }
            }
        } else {
            headers = { Authorization: '' }
        }

        const nuxtConfig = useRuntimeConfig()
        let query: string = useQueryBuilder(nuxtConfig.public.identityApi, endpoint);
        try {
            const result = await $fetch(query, {
                headers: headers,
                params: params,
                onResponseError({ request, response, error, options }) {
                },
                onResponse(ctx) {
                    // console.log('Esto se ejecuta cuando el server responde - onResponse')
                },
                onRequestError() {
                    // console.log("Esto no se bien cuando se ejecute - onRequestError")
                },
                onRequest({ request }) {
                    // console.log('Esto se ejecuta antes de que se envíe la request - onRequest')
                }
            })
            return result;
        } catch (error) {
            console.log(error);

        }
    },
    async put<T>(endpoint: string, headers: any = null, body: any = null): Promise<T> { 
        const accessToken = useCookie('accessToken').value

        if (accessToken) {
            const bearer = `Bearer ${accessToken}`
            if (headers) {
                headers["Authorization"] = bearer
            }
            else {
                headers = { Authorization: bearer }
            }
        }        

        const nuxtConfig = useRuntimeConfig()
        const result = await $fetch(useQueryBuilder(nuxtConfig.public.identityApi, endpoint), {
            method: 'PUT',
            body: body,
            headers: headers
        })
        return <T>result;
    },
    async delete() { },
}