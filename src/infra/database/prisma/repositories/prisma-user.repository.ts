import { Injectable } from '@nestjs/common';

import { User } from 'domain/user.entity';
import { UserMapper } from '../mappers/prisma-user.mapper';
import { PrismaService } from '../prisma.service';
import { IUserRepository } from 'application/contracts/repositories/user.repository';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!userData) return null;
    else {
      const result = UserMapper.toDomain(userData);
      return result;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!prismaUser) return null;
    else {
      const result = UserMapper.toDomain(prismaUser);
      return result;
    }
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: UserMapper.toPrisma(user),
    });
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { email: user.email },
      data: { balance: user.balance.toString() },
    });
  }
}
