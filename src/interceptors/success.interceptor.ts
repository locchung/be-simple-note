import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    let successMessage = 'Success';

    if (request.method === 'POST' && request.url.includes('/auth/signin')) successMessage = 'Login successfully';
    else if (request.method === 'POST') successMessage = 'Created successfully';
    else if (request.method === 'PUT') successMessage = 'Updated successfully';
    else if (request.method === 'DELETE') successMessage = 'Deleted successfully';

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        message: successMessage,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
