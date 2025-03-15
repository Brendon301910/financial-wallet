import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUserRepository } from './prisma/repositories/prisma-user.repository';
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction.repository';
import { IUserRepository } from 'application/contracts/repositories/user.repository';
import { ITransactionRepository } from 'application/contracts/repositories/transaction.repository';

@Module({
  providers: [
    PrismaService,
    PrismaUserRepository,
    PrismaTransactionRepository,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ITransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [IUserRepository, ITransactionRepository],
})
export class DatabaseModule {}
