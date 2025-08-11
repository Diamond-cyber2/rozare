export interface ComponentProps {
    title: string;
    isVisible: boolean;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}