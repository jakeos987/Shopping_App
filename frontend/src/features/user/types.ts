export interface User{
    id:number
    email:string
    role:UserRole
    firstName?:string
}
export interface UserRole{
    role:"USER"|"ADMIN"
}
export interface CreateUserDTO{
    email:string
    password:string
    firstName:string
}
export interface UpdateUserDTO{
    email?:string
    password?:string
    firstName?:string
}
