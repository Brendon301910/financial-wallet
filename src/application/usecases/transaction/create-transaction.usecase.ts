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
    private readonly logger: CustomLoggerService,
    private readonly monitoringService: MonitoringService,
  ) {}

  async execute(
    request: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    const startTime = Date.now();

    this.logger.log(
      `Starting transaction for ${request.senderId} to ${request.receiverId}, amount: ${request.amount}`,
    );

    const sender = await this.userRepository.findById(request.senderId);
    const receiver = await this.userRepository.findById(request.receiverId);

    if (!sender || !receiver) {
      this.logger.warn(
        `User(s) not found. Sender: ${request.senderId}, Receiver: ${request.receiverId}`,
      );

      this.monitoringService.logTransactionStatus('failure');
      this.monitoringService.logTransactionDuration(
        'createTransaction',
        startTime,
      );
      return { transaction: null, error: new Error('User not found') };
    }

    if (sender.balance.lt(request.amount)) {
      this.logger.warn(
        `Insufficient balance for sender ${request.senderId}. Balance: ${sender.balance}, Amount: ${request.amount}`,
      );

      this.monitoringService.logTransactionStatus('failure');
      this.monitoringService.logTransactionDuration(
        'createTransaction',
        startTime,
      );
      return { transaction: null, error: new Error('Insufficient balance') };
    }

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

      this.monitoringService.logTransactionStatus('failure');
      this.monitoringService.logTransactionDuration(
        'createTransaction',
        startTime,
      );
      return { transaction: null, error };
    }

    sender.balance = sender.balance.minus(request.amount);
    receiver.balance = receiver.balance.plus(request.amount);

    await this.transactionRepository.save(transaction);
    await this.userRepository.update(sender);
    await this.userRepository.update(receiver);

    this.logger.log(`Transaction ${transaction.id} completed successfully`);

    this.monitoringService.logTransactionStatus('success');
    this.monitoringService.logTransactionDuration(
      'createTransaction',
      startTime,
    );

    return { transaction, error: null };
  }
}
