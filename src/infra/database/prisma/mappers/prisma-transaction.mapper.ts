import { Transaction as PrismaTransaction } from '@prisma/client';
import { Transaction } from 'domain/transaction.entity';
import { Decimal } from 'decimal.js';

export class TransactionMapper {
  // Converte de Prisma para a entidade do domínio
  static toDomain(prismaTransaction: PrismaTransaction): Transaction {
    return new Transaction({
      id: prismaTransaction.id,
      senderId: prismaTransaction.senderId,
      receiverId: prismaTransaction.receiverId,
      amount: new Decimal(prismaTransaction.amount), // Certifique-se de que o valor é convertido para Decimal aqui
      status: prismaTransaction.status as 'pending' | 'completed' | 'reversed',
      createdAt: prismaTransaction.createdAt,
    });
  }

  // Converte da entidade do domínio para Prisma
  static toPrisma(transaction: Transaction): Omit<PrismaTransaction, 'id'> {
    return {
      senderId: transaction.senderId,
      receiverId: transaction.receiverId,
      amount: transaction.amount, // Aqui usamos .toString() para garantir que o valor seja tratado como string para Prisma
      status: transaction.status,
      createdAt: transaction.createdAt,
    };
  }
}
