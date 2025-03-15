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
}
