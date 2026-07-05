// File Upload Interceptor - File upload handle karne ke liye
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Check karein ke file hai
    if (!request.file && !request.files) {
      throw new BadRequestException('File zaroori hai');
    }

    return next.handle();
  }
}
