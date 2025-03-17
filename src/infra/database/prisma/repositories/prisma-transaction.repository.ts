import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from 'application/contracts/repositories/transaction.repository';
import { Transaction } from 'domain/transaction.entity';
import { TransactionMapper } from '../mappers/prisma-transaction.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(transaction: Transaction): Promise<void> {
    const data = TransactionMapper.toPrisma(transaction);
    await this.prisma.transaction.create({ data });
  }

  async update(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: transaction.status },
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    const transactionData = await this.prisma.transaction.findUnique({
      where: { id: id },
    });

    if (!transactionData) return null;
    else {
      const result = TransactionMapper.toDomain(transactionData);
      return result;
    }
  }
}
