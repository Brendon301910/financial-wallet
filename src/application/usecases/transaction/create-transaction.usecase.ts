import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { IUserRepository } from 'application/contracts/repositories/user.repository';
import { ITransactionRepository } from 'application/contracts/repositories/transaction.repository';
import { CustomLoggerService } from 'src/infra/logger/logger.service';

import { Transaction } from 'domain/transaction.entity';
import {
  CreateTransactionRequest,
  CreateTransactionResponse,
  ICreateTransactionContract,
} from 'application/contracts/contracts/transaction.contract';
import { MonitoringService } from 'src/monitoring/monitoring.service';

@Injectable()
export class CreateTransactionUseCase implements ICreateTransactionContract {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly logger: CustomLoggerService, // Injeta o logger
    private readonly monitoringService: MonitoringService, // Injeta o MonitoringService
  ) {}

  async execute(
    request: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    const startTime = Date.now(); // Registra o tempo de início

    this.logger.log(
      `Starting transaction for ${request.senderId} to ${request.receiverId}, amount: ${request.amount}`,
    );

    // Buscar usuários
    const sender = await this.userRepository.findById(request.senderId);
    const receiver = await this.userRepository.findById(request.receiverId);

    if (!sender || !receiver) {
      this.logger.warn(
        `User(s) not found. Sender: ${request.senderId}, Receiver: ${request.receiverId}`,
      );

      this.monitoringService.logTransactionStatus('failure'); // Incrementa a métrica de falha
      this.monitoringService.logTransactionDuration(
        'createTransaction',
        startTime,
      ); // Registra a duração do processo
      return { transaction: null, error: new Error('User not found') };
    }

    // Validar saldo do remetente
    if (sender.balance.lt(request.amount)) {
      this.logger.warn(
        `Insufficient balance for sender ${request.senderId}. Balance: ${sender.balance}, Amount: ${request.amount}`,
      );

      this.monitoringService.logTransactionStatus('failure'); // Incrementa a métrica de falha
      this.monitoringService.logTransactionDuration(
        'createTransaction',
        startTime,
      ); // Registra a duração do processo
      return { transaction: null, error: new Error('Insufficient balance') };
    }

    // Criar a transação
    const [transaction, error] = Transaction.create({
      senderId: request.senderId,
      receiverId: request.receiverId,
      amount: request.amount,
      status: 'completed',
    });

    if (error) {
      this.logger.error(
        `Error creating transaction: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error.stack || 'No stack trace available',
      );

      this.monitoringService.logTransactionStatus('failure'); // Incrementa a métrica de falha
      this.monitoringService.logTransactionDuration(
        'createTransaction',
        startTime,
      ); // Registra a duração do processo
      return { transaction: null, error };
    }

    // Atualizar saldos
    sender.balance = sender.balance.minus(request.amount);
    receiver.balance = receiver.balance.plus(request.amount);

    // Salvar no repositório
    await this.transactionRepository.save(transaction);
    await this.userRepository.update(sender);
    await this.userRepository.update(receiver);

    this.logger.log(`Transaction ${transaction.id} completed successfully`);

    // Incrementa a métrica de sucesso e registra a duração
    this.monitoringService.logTransactionStatus('success');
    this.monitoringService.logTransactionDuration(
      'createTransaction',
      startTime,
    );

    return { transaction, error: null };
  }
}
