// Roles Guard - Role-based authorization ke liye
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // canActivate method - check karega ke user ki required role hai ya nahi
  canActivate(context: ExecutionContext): boolean {
    // Required roles ko decorator se lein
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Agar koi specific role required nahi hai, toh allow karein
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Request object se user lein
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Agar user nahi hai, toh deny karein
    if (!user) {
      throw new ForbiddenException('Access denied - User not authenticated');
    }

    // Check karein ke user ki role required roles mein hai ya nahi
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException('Access denied - Insufficient permissions');
    }

    return true;
  }
}
