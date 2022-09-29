import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import RequestWithUser from '../interface/requestWithUser.interface';
import { ROLES_KEY } from '../role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const roles = this.reflector.get<string[]>(
        ROLES_KEY,
        context.getHandler(),
      );

      if (!roles) {
        return true;
      }

      const req = context.switchToHttp().getRequest<RequestWithUser>();
      const user: User = req.user;

      if (!roles.includes(user.role.name))
        throw new HttpException('Отказано в доступе', HttpStatus.FORBIDDEN);

      return true;
    } catch (err) {
      console.log(err);
      throw new HttpException('Отказано в доступе', HttpStatus.FORBIDDEN);
    }
  }
}
