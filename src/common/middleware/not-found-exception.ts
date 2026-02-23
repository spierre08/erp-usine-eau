import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    res.status(HttpStatus.NOT_FOUND).json({
      message: "La route demandée n'existe pas",
      error: 'Not Found',
      statusCode: 404,
    });
  }
}
