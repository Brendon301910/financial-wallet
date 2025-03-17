import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUserRepository } from './prisma/repositories/prisma-user.repository';
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction.repository';
import { PrismaReversalRepository } from './prisma/repositories/prisma-reverse-transaction.repository';
import { IUserRepository } from 'application/contracts/repositories/user.repository';
import { ITransactionRepository } from 'application/contracts/repositories/transaction.repository';
import { IReversalRepository } from 'application/contracts/repositories/reversal.repository';
import { MonitoringModule } from 'src/monitoring/monitoring.module';

@Module({
  imports: [MonitoringModule], // Adicione o MonitoringModule aqui
  providers: [
    PrismaService,
    PrismaUserRepository,
    PrismaTransactionRepository,
    PrismaReversalRepository,
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
      useClass: PrismaReversalRepository,
    },
  ],
  exports: [IUserRepository, ITransactionRepository, IReversalRepository],
})
export class DatabaseModule {}
