const _cookieName = "SECURITYTOKEN";
export const useEbooking = {
    async post(endpoint: string, headers: any, body: any) {
        const runtimeConfig = useRuntimeConfig()
        const securityToken = useCookie(_cookieName).value
        headers = Object.assign({
            'Accept': 'application/json',
            'AgencyId': runtimeConfig.public.agencyId,
            'OwnerId': runtimeConfig.public.ownerId,
            'WebSiteId': runtimeConfig.public.websiteId
        }, headers)
        if (securityToken) {
            headers = Object.assign({ 'SECURITYTOKEN': securityToken }, headers)
        }
        
        const result = await $fetch(useQueryBuilder(runtimeConfig.public.ebookingApi, endpoint), {
            method: 'POST',
            body: body,
            headers: headers,
            onResponseError({ request, response, error, options }) {
            },
            onResponse(ctx) {
                //do sth
            },
            onRequestError() {
                //     alert("Esto no se bien cuando se ejecuta - onRequestError")
            },
            onRequest({ request }) {
                //do sth
            }
        })
        return result;
    },
    async get<T>(endpoint: string, headers: any, params: any) {
        const runtimeConfig = useRuntimeConfig()
        const securityToken = useCookie("SECURITYTOKEN").value
        headers = Object.assign({
            'Accept': 'application/json',
            'AgencyId': runtimeConfig.public.agencyId,
            'OwnerId': runtimeConfig.public.ownerId,
            'WebSiteId': runtimeConfig.public.websiteId
        }, headers)
        if (securityToken) {
            headers = Object.assign({ 'SECURITYTOKEN': securityToken }, headers)
        }
        

        let query: string = useQueryBuilder(runtimeConfig.public.ebookingApi, endpoint);
        return await $fetch<T>(query, {
            headers: headers,
            params: params,
            onResponseError({ request, response, error, options }) {

            },
            onResponse(ctx) {
                //do sth
            },
            onRequestError() {
                //        alert("Esto no se bien cuando se ejecuta - onRequestError")
            },
            onRequest({ request }) {
                //do sth
            }
        })
    },
    async put() { },
    async delete() { },
}