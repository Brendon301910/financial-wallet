import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { TransactionController } from './controllers/transaction.controller'; // Novo controller de transação
import { DatabaseModule } from '../database/database.module';
import { CreateUserUseCase } from 'application/usecases/user/create-user.usecase';
import { ICreateUserContract } from 'application/contracts/contracts/user.contract';
import { CreateTransactionUseCase } from 'application/usecases/transaction/create-transaction.usecase'; // Novo caso de uso de transação
import { ICreateTransactionContract } from 'application/contracts/contracts/transaction.contract'; // Novo contrato de transação

@Module({
  imports: [DatabaseModule],
  controllers: [UserController, TransactionController], // Adicionando o novo controlador de transações
  providers: [
    {
      provide: ICreateUserContract,
      useClass: CreateUserUseCase,
    },
    {
      provide: ICreateTransactionContract,
      useClass: CreateTransactionUseCase, // Registrando o caso de uso de transação
    },
  ],
  exports: [ICreateUserContract, ICreateTransactionContract], // Expondo o contrato de transação
})
export class HttpModule {}
