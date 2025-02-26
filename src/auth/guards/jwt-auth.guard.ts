import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context); // Calls Passport's default validation
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized Access');
    }
    return user; // Attach user to request
  }
}
