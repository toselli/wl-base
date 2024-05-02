export default (headers: any) => {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
        const bearer = `Bearer ${accessToken}`
        headers = Object.assign({ "Authorization": bearer })
    }
}