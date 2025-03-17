import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { TransactionController } from './controllers/transaction.controller';

import { DatabaseModule } from '../database/database.module';
import { CreateUserUseCase } from 'application/usecases/user/create-user.usecase';
import { ICreateUserContract } from 'application/contracts/contracts/user.contract';
import { CreateTransactionUseCase } from 'application/usecases/transaction/create-transaction.usecase';
import { ICreateTransactionContract } from 'application/contracts/contracts/transaction.contract';
import { ReversalController } from './controllers/reverse-transaction.controller';
import { IReverseTransactionContract } from 'application/contracts/contracts/reverse-transaction.contract';
import { ReverseTransactionUseCase } from 'application/usecases/reversal/reversal-transaction.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController, TransactionController, ReversalController], // Adicionando o novo controlador de reversão
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
      useClass: ReverseTransactionUseCase, // Registrando o caso de uso de reversão
    },
  ],
  exports: [
    ICreateUserContract,
    ICreateTransactionContract,
    IReverseTransactionContract,
  ], // Expondo o contrato de reversão
})
export class HttpModule {}
