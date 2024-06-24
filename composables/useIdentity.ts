import useQueryBuilder from "./useQueryBuilder"

export const useIdentity = {
    async post<T>(endpoint: string, headers: any = {}, body: any = null): Promise<T> {
        const accessToken = useCookie('accessToken').value

        if (accessToken && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${accessToken}`
        }

        const runtimeConfig = useRuntimeConfig()
        const result = await $fetch(useQueryBuilder(runtimeConfig.public.identityApi, endpoint), {
            method: 'POST',
            body: body,
            headers: headers
        })
        return <T>result;
    },
    async get(endpoint: string, headers: any = {}, params: any = null) {
        const accessToken = useCookie('accessToken').value

        if (accessToken && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${accessToken}`
        }

        const runtimeConfig = useRuntimeConfig()
        const query = useQueryBuilder(runtimeConfig.public.identityApi, endpoint)

        try {
            const result = await $fetch(query, {
                headers: headers,
                params: params,
                onResponseError({ request, response, error, options }) {
                    console.error('Response error', error)
                },
                onResponse(ctx) {
                    console.log('Response received', ctx)
                },
                onRequestError() {
                    console.error('Request error')
                },
                onRequest({ request }) {
                    console.log('Request initiated', request)
                }
            })
            return result;
        } catch (error) {
            console.log(error);
        }
    },
    async put<T>(endpoint: string, headers: any = {}, body: any = null): Promise<T> {
        const accessToken = useCookie('accessToken').value

        if (accessToken && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${accessToken}`
        }

        const runtimeConfig = useRuntimeConfig()
        const result = await $fetch(useQueryBuilder(runtimeConfig.public.identityApi, endpoint), {
            method: 'PUT',
            body: body,
            headers: headers
        })
        return <T>result;
    },
    async delete(endpoint: string, headers: any = {}, body: any = null): Promise<void> {
        const accessToken = useCookie('accessToken').value

        if (accessToken && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${accessToken}`
        }

        const runtimeConfig = useRuntimeConfig()
        await $fetch(useQueryBuilder(runtimeConfig.public.identityApi, endpoint), {
            method: 'DELETE',
            body: body,
            headers: headers
        })
    },
}
