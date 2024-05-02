export interface LoginRequest {
    username: string;
    password: string;
    isAuthorized: boolean;
    accessToken?: string;
    refreshToken?: string;
    securityToken?: string;
}