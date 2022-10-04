import { Role } from '../entities/role.entity';

export class UpdateUserDto {
  public name?: string;

  public role?: Role;

  public login?: string;

  public password?: string;
}
