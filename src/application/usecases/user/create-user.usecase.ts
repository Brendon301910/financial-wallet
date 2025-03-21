import { User } from 'domain/user.entity';
import Decimal from 'decimal.js';

import { IUserRepository } from 'application/contracts/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import {
  CreateUserRequest,
  CreateUserResponse,
  ICreateUserContract,
} from 'application/contracts/contracts/user.contract';

@Injectable()
export class CreateUserUseCase implements ICreateUserContract {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const userExists = await this.userRepository.findByEmail(request.email);

    if (userExists) {
      return { user: null, error: new Error('User already exists') };
    }

    const [user, error] = User.create({
      email: request.email,
      password: request.password,
      name: request.name,
      balance: new Decimal(request.balance),
    });

    if (error) {
      return { user: null, error };
    }

    await this.userRepository.save(user);

    return { user, error: null };
  }
}
