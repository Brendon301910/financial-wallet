import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUserRepository } from './prisma/repositories/prisma-user.repository';
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction.repository';

import { IUserRepository } from 'application/contracts/repositories/user.repository';
import { ITransactionRepository } from 'application/contracts/repositories/transaction.repository';
import { IReversalRepository } from 'application/contracts/repositories/reversal.repository'; // Importe o contrato do repositório de reversão
import { PrismaReversalRepository } from './prisma/repositories/prisma-reverse-transaction.repository';

@Module({
  providers: [
    PrismaService,
    PrismaUserRepository,
    PrismaTransactionRepository,
    PrismaReversalRepository, // Adicione o repositório de reversão aos provedores
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ITransactionRepository,
      useClass: PrismaTransactionRepository,
    },
    {
      provide: IReversalRepository,
      useClass: PrismaReversalRepository, // Adicione a injeção do repositório de reversão
    },
  ],
  exports: [
    IUserRepository,
    ITransactionRepository,
    IReversalRepository, // Exporte o contrato de repositório de reversão
  ],
})
export class DatabaseModule {}
