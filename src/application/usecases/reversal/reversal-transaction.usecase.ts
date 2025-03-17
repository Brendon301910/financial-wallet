import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from 'application/contracts/repositories/transaction.repository';
import { IUserRepository } from 'application/contracts/repositories/user.repository';
import { IReversalRepository } from 'application/contracts/repositories/reversal.repository';
import { Reversal } from 'domain/reversal.entity';
import {
  IReverseTransactionContract,
  ReverseTransactionRequest,
  ReverseTransactionResponse,
} from 'application/contracts/contracts/reverse-transaction.contract';
import { CustomLoggerService } from 'src/infra/logger/logger.service';
import { MonitoringService } from 'src/monitoring/monitoring.service';

@Injectable()
export class ReverseTransactionUseCase implements IReverseTransactionContract {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userRepository: IUserRepository,
    private readonly reversalRepository: IReversalRepository,
    private readonly logger: CustomLoggerService,
    private readonly monitoringService: MonitoringService,
  ) {}

  async execute(
    request: ReverseTransactionRequest,
  ): Promise<ReverseTransactionResponse> {
    const startTime = Date.now();

    const { transactionId, reason } = request;

    const transaction = await this.transactionRepository.findById(
      transactionId,
    );

    if (!transaction) {
      this.logger.warn(`Transaction ${transactionId} not found.`);
      this.monitoringService.logTransactionStatus('failure');
      this.monitoringService.logReversalStatus('failure');
      this.monitoringService.logTransactionDuration(
        'reverseTransaction',
        startTime,
      );
      return { reversal: null, error: new Error('Transaction not found') };
    }

    if (transaction.status === 'reversed') {
      this.logger.warn(
        `Transaction ${transactionId} has already been reversed.`,
      );
      this.monitoringService.logTransactionStatus('failure');
      this.monitoringService.logReversalStatus('failure');
      this.monitoringService.logTransactionDuration(
        'reverseTransaction',
        startTime,
      );
      return {
        reversal: null,
        error: new Error('Transaction has already been reversed'),
      };
    }

    if (transaction.status !== 'completed') {
      this.logger.warn(
        `Transaction ${transactionId} cannot be reversed, it is not completed.`,
      );
      this.monitoringService.logReversalStatus('failure');
      this.monitoringService.logTransactionDuration(
        'reverseTransaction',
        startTime,
      );
      return {
        reversal: null,
        error: new Error('Transaction cannot be reversed, it is not completed'),
      };
    }

    const sender = await this.userRepository.findById(transaction.senderId);
    const receiver = await this.userRepository.findById(transaction.receiverId);

    if (!sender || !receiver) {
      this.logger.warn(
        `User(s) involved not found. Sender: ${transaction.senderId}, Receiver: ${transaction.receiverId}`,
      );
      this.monitoringService.logTransactionStatus('failure');
      this.monitoringService.logReversalStatus('failure');
      this.monitoringService.logTransactionDuration(
        'reverseTransaction',
        startTime,
      );
      return { reversal: null, error: new Error('User(s) involved not found') };
    }

    sender.balance = sender.balance.plus(transaction.amount);
    receiver.balance = receiver.balance.minus(transaction.amount);

    await this.userRepository.update(sender);
    await this.userRepository.update(receiver);

    const [reversal, reversalError] = Reversal.create({
      transactionId: transaction.id,
      reason,
    });

    if (reversalError) {
      this.logger.error(
        `Error creating reversal for transaction ${transactionId}: ${
          reversalError instanceof Error
            ? reversalError.message
            : 'Unknown error'
        }`,
        reversalError.stack || 'No stack trace available',
      );
      this.monitoringService.logTransactionStatus('failure');
      this.monitoringService.logReversalStatus('failure');
      this.monitoringService.logTransactionDuration(
        'reverseTransaction',
        startTime,
      );
      return { reversal: null, error: reversalError };
    }

    await this.reversalRepository.save(reversal);

    transaction.status = 'reversed';
    await this.transactionRepository.update(transaction);

    this.logger.log(`Transaction ${transactionId} reversed successfully`);

    this.monitoringService.logTransactionStatus('success');
    this.monitoringService.logReversalStatus('success');
    this.monitoringService.logTransactionDuration(
      'reverseTransaction',
      startTime,
    );

    return { reversal, error: null };
  }
}
