import {type User } from '../user/types'
export interface AuthResponse{
    token:string
    user:User
}