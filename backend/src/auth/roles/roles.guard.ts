import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector: Reflector){}
    canActivate(context: ExecutionContext):boolean{

        const requierdRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ]);
        console.log('---Debug RolesGuard---')
        console.log('1. Required Roles (from decorator):', requierdRoles)

        if(!requierdRoles){
            console.log('✅ No roles required -> Access Granted')
            return true
        }
        
        const {user} = context.switchToHttp().getRequest()
        console.log('2. User attached to request:', user);
        if(!user){
            console.error('❌ Error: User object is missing! Did you use JwtAuthGuard before RolesGuard?')
            return false
        }
        console.log('3. User Role form Token:', user.role);
        if(!user.role){
            console.error('❌ Error: User exists but has NO role. Check your AuthService payload!')
            return false
        }
        // return requierdRoles.some((role) => user.role === role)
        const hasRole = requierdRoles.some((role)=> user.role === role)
        if(hasRole){
            console.log('✅ Access Granted: Role matched!')
        }else{
            console.log(`⛔ Access Denied: User role "${user.role}" does not match required "${requierdRoles}"`)
        }
        return hasRole
    }
}