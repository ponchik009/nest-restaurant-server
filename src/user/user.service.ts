import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepo: Repository<User>,
  ) {}

  public async getById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async getByLogin(login: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { login },
    });

    if (!user) {
      throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async create(dto: CreateUserDto) {
    try {
      const user = this.userRepo.create({ ...dto, role: { id: dto.roleId } });
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
