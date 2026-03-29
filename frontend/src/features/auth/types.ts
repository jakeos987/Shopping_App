import {type User } from '../user/types'
export interface AuthResponse{
    access_token:string
    user:User
}
export interface loginDto{
    email:string
    password:string
}
export interface registerDto{
    email:string
    password:string
    firstName:string
    lastName:string
}