// JWT Authentication Guard - Protected routes ke liye JWT token validation
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // canActivate method - check karega ke route public hai ya protected
  canActivate(context: ExecutionContext) {
    // Check karein ke route par @Public() decorator hai ya nahi
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Agar route public hai, toh bypass JWT validation
    if (isPublic) {
      return true;
    }

    // Warna JWT validation perform karein
    return super.canActivate(context);
  }
}
