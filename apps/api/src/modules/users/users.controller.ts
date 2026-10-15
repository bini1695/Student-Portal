import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DEPT_HEAD, Role.ACCOUNTANT)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // POST /users
  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // PATCH /users/:id
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: { id: number },
  ) {
    if (user.id === id && dto.status && dto.status !== 'active') {
      throw new ForbiddenException('You cannot deactivate your own account.');
    }
    return this.usersService.update(id, dto);
  }

  // DELETE /users/:id
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}