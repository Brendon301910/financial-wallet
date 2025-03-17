import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { TransactionController } from './controllers/transaction.controller';
import { ReversalController } from './controllers/reverse-transaction.controller';

import { DatabaseModule } from '../database/database.module';

import { CreateUserUseCase } from 'application/usecases/user/create-user.usecase';
import { ICreateUserContract } from 'application/contracts/contracts/user.contract';
import { CreateTransactionUseCase } from 'application/usecases/transaction/create-transaction.usecase';
import { ICreateTransactionContract } from 'application/contracts/contracts/transaction.contract';
import { ReverseTransactionUseCase } from 'application/usecases/reversal/reversal-transaction.usecase';
import { IReverseTransactionContract } from 'application/contracts/contracts/reverse-transaction.contract';
import { MonitoringModule } from 'src/monitoring/monitoring.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [DatabaseModule, MonitoringModule, LoggerModule], // Adicione o MonitoringModule aqui
  controllers: [UserController, TransactionController, ReversalController],
  providers: [
    {
      provide: ICreateUserContract,
      useClass: CreateUserUseCase,
    },
    {
      provide: ICreateTransactionContract,
      useClass: CreateTransactionUseCase,
    },
    {
      provide: IReverseTransactionContract,
      useClass: ReverseTransactionUseCase,
    },
  ],
  exports: [
    ICreateUserContract,
    ICreateTransactionContract,
    IReverseTransactionContract,
  ],
})
export class HttpModule {}
