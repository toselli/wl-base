export default (apiUrl: string, endpoint: string) => {
    let url = `${apiUrl}${endpoint}`;
    return url;
}