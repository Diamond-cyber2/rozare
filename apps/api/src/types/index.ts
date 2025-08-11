export interface ApiRequest {
    body?: any;
    params?: Record<string, any>;
    query?: Record<string, any>;
}

export interface ApiResponse<T = any> {
    status: number;
    data?: T;
    error?: string;
}

export interface AuthenticatedRequest extends ApiRequest {
    user?: {
        id: string;
        role: string;
    };
}