export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface ApiRequest {
    body?: any;
    params?: Record<string, any>;
    query?: Record<string, any>;
}