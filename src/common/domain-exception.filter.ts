import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from './domain.error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (!response) return;

    response.status(400).json({
      statusCode: 400,
      message: exception.message,
      error: 'Bad Request (Domain)',
    });
  }
}
