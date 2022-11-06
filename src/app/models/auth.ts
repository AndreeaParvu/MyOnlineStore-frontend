export interface SignUpRequest {
    email: string,
    password: string,
    role?: string
}

export interface LoginRequest {
    email: string,
    password: string
}

export interface JwtResponse {
    token: string,
    userId: string,
    email: string,
    roles: string[]
}