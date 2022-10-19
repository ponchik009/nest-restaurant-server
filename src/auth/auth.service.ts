import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/createUserDto.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async register(userDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const createdUser = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });

    createdUser.password = undefined;

    return createdUser;
  }

  public async getAuthenticatedUser(login: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getByLogin(login);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('Неверные данные входа!', HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException('Неверные данные входа!', HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}; HttpOnly; Path=/api; SameSite=None; Secure`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Max-Age=0; Path=/api; SameSite=None; Secure`; // SameSite=None; Secure
  }
}
