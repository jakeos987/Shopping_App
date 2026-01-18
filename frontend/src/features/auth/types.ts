import {type User } from '../user/types'
export interface AuthResponse{
    access_token:string
    user:User
}