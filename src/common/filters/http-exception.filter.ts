// HTTP Exception Filter - Global error handling ke liye
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Status code aur message extract karein
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Error response format karein
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || exception.message,
      error: HttpStatus[status] || 'Error',
    };

    // Agar validation errors hain, toh details add karein
    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      const messages = (exceptionResponse as any).message;
      if (Array.isArray(messages)) {
        errorResponse.message = messages;
      }
    }

    // Error response send karein
    response.status(status).json(errorResponse);
  }
}
