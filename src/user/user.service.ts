import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto.dto';
import { Role } from './entities/role.entity';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepo: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private roleRepo: Repository<Role>,
  ) {}

  public async getById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
    }

    user.password = undefined;

    return user;
  }

  public async getByLogin(login: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { login },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async create(dto: CreateUserDto) {
    let role = null;
    try {
      role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
    } catch (err) {
      throw new HttpException('Роль не найдена!', HttpStatus.NOT_FOUND);
    }

    try {
      const user = this.userRepo.create({ ...dto, role });
      return await this.userRepo.save(user);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Пользователь с такими данными уже существует!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
