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
        if(!requierdRoles){
            return true
        }
        
        const {user} = context.switchToHttp().getRequest()
        if(!user){
            console.error('❌ Error: User object is missing! Did you use JwtAuthGuard before RolesGuard?')
            return false
        }
        if(!user.role){
            return false
        }
        const hasRole = requierdRoles.some((role)=> user.role === role)
        if(hasRole){
        }
        return hasRole
    }
}