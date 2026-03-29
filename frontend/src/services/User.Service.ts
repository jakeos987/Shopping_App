import { api } from './api';
import type { User, CreateUserDTO, UpdateUserDTO, UserRole } from '../features/user/types';

export const userService = {
    async getAll(){
        const res = await api.get<User[]>('/users')
        return res.data
    },
    async getOne(id:number|string){
        const res = await api.get<User>(`/users/${id}`)
        return res.data
    },
    async create(userData:CreateUserDTO){
        const res = await api.post<User>('/users',userData)
        return res.data
    },
    async update(id:number|string, userData:UpdateUserDTO){
        const res = await api.patch<User>(`/users/${id}`,userData)
        return res.data
    },
    async updateUserRole(id:number| string, role: UserRole){
        const res = await api.patch<User>(`/users/${id}`,{role})
        return res.data
    },
    async remove(id:number|string){
        const res = await api.patch(`/users/${id}`)
        return res.data
    }
}