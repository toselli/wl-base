const _cookieName = "SECURITYTOKEN";
export const useHistorical = {
    async post(endpoint: string, headers: any, body: any) {
        const nuxtConfig = useRuntimeConfig()
        const securityToken = useCookie(_cookieName).value
        headers = Object.assign({
            'Accept': 'application/json',
            'AgencyId': nuxtConfig.public.agencyId,
            'OwnerId': nuxtConfig.public.ownerId,
            'WebSiteId': nuxtConfig.public.websiteId
        }, headers)
        if (securityToken) {
            headers = Object.assign({ 'SECURITYTOKEN': securityToken }, headers)
        }
        
        const result = await $fetch(useQueryBuilder(nuxtConfig.public.historical, endpoint), {
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
        const nuxtConfig = useRuntimeConfig()
        const securityToken = useCookie("SECURITYTOKEN").value
        headers = Object.assign({
            'Accept': 'application/json',
            'AgencyId': nuxtConfig.public.agencyId,
            'OwnerId': nuxtConfig.public.ownerId,
            'WebSiteId': nuxtConfig.public.websiteId
        }, headers)
        if (securityToken) {
            headers = Object.assign({ 'SECURITYTOKEN': securityToken }, headers)
        }
        

        let query: string = useQueryBuilder(nuxtConfig.public.historical, endpoint);
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