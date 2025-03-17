import { Reversal as PrismaReversal } from '@prisma/client';
import { Reversal } from 'domain/reversal.entity';

export class ReversalMapper {
  // Converte de Prisma para a entidade do domínio
  static toDomain(prismaReversal: PrismaReversal): Reversal {
    return new Reversal({
      id: prismaReversal.id,
      transactionId: prismaReversal.transactionId,
      reason: prismaReversal.reason,
      createdAt: prismaReversal.createdAt,
    });
  }

  // Converte da entidade do domínio para Prisma
  static toPrisma(reversal: Reversal): Omit<PrismaReversal, 'id'> {
    return {
      transactionId: reversal.transactionId,
      reason: reversal.reason,
      createdAt: reversal.createdAt,
    };
  }
}
