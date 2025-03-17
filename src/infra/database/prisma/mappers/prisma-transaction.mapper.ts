import { Transaction as PrismaTransaction } from '@prisma/client';
import { Transaction } from 'domain/transaction.entity';
import { Decimal } from 'decimal.js';

export class TransactionMapper {
  static toDomain(prismaTransaction: PrismaTransaction): Transaction {
    return new Transaction({
      id: prismaTransaction.id,
      senderId: prismaTransaction.senderId,
      receiverId: prismaTransaction.receiverId,
      amount: new Decimal(prismaTransaction.amount),
      status: prismaTransaction.status as 'pending' | 'completed' | 'reversed',
      createdAt: prismaTransaction.createdAt,
    });
  }

  static toPrisma(transaction: Transaction): Omit<PrismaTransaction, 'id'> {
    return {
      senderId: transaction.senderId,
      receiverId: transaction.receiverId,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createdAt,
    };
  }
}
