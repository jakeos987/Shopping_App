import { api } from './api';
import { type AuthResponse } from '../features/auth/types';
import { type loginDto, type registerDto } from '../features/auth/types';
import { type User } from '../features/user/types';


export const AuthService = {
    async register(data: registerDto) {
        const res = await api.post<AuthResponse>('/auth/register', data)
        return {
            user: res.data.user,
            token: res.data.access_token
        }
    },
    async login(data: loginDto) {
        const res = await api.post<AuthResponse>('/auth/login', data)
        return {
            user: res.data.user,
            token: res.data.access_token
        }
    },
    async getProfile() {
        const res = await api.get('/auth/profile')
        return res.data
    },
    async getMe() {
        const res = await api.get<User>('/auth/profile')
        return res.data
    },
}