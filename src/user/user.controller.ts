import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { MANAGER } from 'src/const/roles';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @Get()
  async getAll() {
    return this.userService.getAll();
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @Get('/roles')
  async getRoles() {
    return this.userService.getRoles();
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.userService.getByIdForManager(id);
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @Patch('/block/:id')
  async block(@Param('id') id: number) {
    return this.userService.block(id);
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @Patch('/unblock/:id')
  async unblock(@Param('id') id: number) {
    return this.userService.unblock(id);
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }
}
