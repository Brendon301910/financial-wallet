import { Injectable } from '@nestjs/common';

import { User } from 'domain/user.entity';
import { UserMapper } from '../mappers/prisma-user.mapper';
import { PrismaService } from '../prisma.service';
import { IUserRepository } from 'application/contracts/repositories/user.repository';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    // Buscar o usuário pelo id no banco de dados
    const userData = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!userData) return null;
    else {
      const result = UserMapper.toDomain(userData);
      return result;
    }
  }
  // Buscar usuário por email
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

  // Salvar usuário no banco
  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: UserMapper.toPrisma(user),
    });
  }

  // Atualizar dados do usuário
  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { email: user.email }, // Assume que o email é único e serve como chave de busca
      data: { balance: user.balance.toString() }, // Atualiza o saldo
    });
  }
}
