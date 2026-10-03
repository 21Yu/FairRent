export interface RegisterFormValues {
    userName: string;
    email: string;
    password: string;
};

export interface LoginFormValues {
    email: string;
    password: string;
};

export interface UserResponse {
    id: string;
    email: string;
    user_name: string;
    saved_listings: string[];
    is_admin: boolean;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}