import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or absent token');
    }

    const token = authHeader.replace('Bearer ', '');

    if (token !== 'seu-token-valido') {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }
}
