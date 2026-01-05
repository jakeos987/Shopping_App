import { Injectable } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class jwtAuthguard extends AuthGuard('local'){}
