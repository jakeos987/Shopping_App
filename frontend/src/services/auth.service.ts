import { api } from './api';
import {type AuthResponse } from '../features/auth/types';

interface loginDto{
    email:string
    password:string
}
interface registerDto{
    email:string
    password:string
}
export const AuthService={
    async register(data:registerDto){
        const res = await api.post<AuthResponse>('/auth/register',data)
        return res.data
    },
    async login(data:loginDto){
        const res = await api.post<AuthResponse>('/auth/login',data)
        return res.data
    },
}