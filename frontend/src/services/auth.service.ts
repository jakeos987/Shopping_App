import { api } from './api';
import {type AuthResponse } from '../features/auth/types';

interface loginDto{
    email:string
    password:string
}
interface registerDto{
    email:string
    password:string
    firstName:string
    lastName:string
}
export const AuthService={
    async register(data:registerDto){
        const res = await api.post<AuthResponse>('/auth/register',data)
        return {
            user: res.data.user,
            token: res.data.access_token
        }
    },
    async login(data:loginDto){
        const res = await api.post<AuthResponse>('/auth/login',data)
        return {
            user: res.data.user,
            token: res.data.access_token
        }
    },
}