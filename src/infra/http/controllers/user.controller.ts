import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from 'application/usecases/user/create-user.usecase';
import { CreateUserDto } from '../dtos/create-user.dto';

import { User } from 'domain/user.entity';
import Decimal from 'decimal.js';
import { ICreateUserContract } from 'application/contracts/contracts/user.contract';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private createUser: ICreateUserContract) {}

  @ApiOperation({ summary: 'Create a new User' })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or user already exists',
  })
  async create(@Body() body: CreateUserDto) {
    const { email, password, name, balance } = body;

    const [user, error] = User.create({
      email: email,
      name: name,
      password: password,
      balance: new Decimal(balance),
    });

    const response = await this.createUser.execute(user);

    if (response.error) {
      // Lançando o erro com a mensagem diretamente da camada de domínio
      throw new HttpException(
        {
          message: response.error.message, // A mensagem de erro que vem do domínio
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return { user: response };
  }
}
