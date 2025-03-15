import { User as PrismaUser } from '@prisma/client';
import { Decimal } from 'decimal.js';
import { User } from 'domain/user.entity';

export class UserMapper {
  static toDomain(userPrisma: PrismaUser): User {
    return new User({
      email: userPrisma.email,
      password: userPrisma.password,
      name: userPrisma.name,
      balance: new Decimal(userPrisma.balance), // 🔹 Converte para Decimal
      id: userPrisma.id,
    });
  }

  static toPrisma(userDomain: User): Omit<PrismaUser, 'id'> {
    return {
      email: userDomain.email,
      password: userDomain.password,
      name: userDomain.name,
      balance: userDomain.balance, // Já está como Decimal
      createdAt: new Date(),
    };
  }
}
