import useQueryBuilder from "./useQueryBuilder"

export const useCloudMessaging = {
    async post<T>(endpoint: string, headers: any = null, body: any = null): Promise<T> {
        const runtimeConfig = useRuntimeConfig()
        const result = await $fetch(`${runtimeConfig.public.cloudMessagingApi}${endpoint}`, {
            method: 'POST',
            body: body,
            headers: headers
        })
        return <T>result;
    },
    async get(endpoint: string, headers: any = null, params: any = null) {
        const runtimeConfig = useRuntimeConfig()
        let query: string = useQueryBuilder(runtimeConfig.public.cloudMessagingApi, endpoint, params);
        try {
            const result = await $fetch(query, {
                headers: headers,
                onResponseError({ request, response, error, options }) {
                    // console.log('Esto se ejecuta cuando el server devuelve un error - onResponseError')
                    // console.log('onResponseError - Status code: ' + response.status)
                    // console.log('onResponseError - Body: ' + response.body)
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
    async put() { },
    async delete() { },
}