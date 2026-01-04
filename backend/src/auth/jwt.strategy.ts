import { ExtractJwt} from 'passport-jwt'
import {PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common' 
import { Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:'lksf',
        });
    }
    async validate(payLoad:any){
        return {userId:payLoad.sub,email:payLoad.email,role:payLoad.role}
    }
}