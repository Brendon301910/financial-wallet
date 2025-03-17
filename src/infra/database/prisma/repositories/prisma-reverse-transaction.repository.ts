import { Injectable } from '@nestjs/common';
import { IReversalRepository } from 'application/contracts/repositories/reversal.repository';
import { Reversal } from 'domain/reversal.entity';
import { PrismaService } from '../prisma.service';
import { ReversalMapper } from '../mappers/reverse-transaction.mapper';

@Injectable()
export class PrismaReversalRepository implements IReversalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(reversal: Reversal): Promise<void> {
    const data = ReversalMapper.toPrisma(reversal);
    await this.prisma.reversal.create({ data });
  }

  async update(reversal: Reversal): Promise<void> {
    await this.prisma.reversal.update({
      where: { id: reversal.id },
      data: {
        reason: reversal.reason,
        createdAt: reversal.createdAt,
      },
    });
  }
}
