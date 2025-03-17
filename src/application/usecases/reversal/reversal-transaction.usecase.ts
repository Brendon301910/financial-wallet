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
    private readonly reversalRepository: IReversalRepository, // Repositório para reversão
    private readonly logger: CustomLoggerService, // Injeta o logger
    private readonly monitoringService: MonitoringService, // Injeta o MonitoringService
  ) {}

  async execute(
    request: ReverseTransactionRequest,
  ): Promise<ReverseTransactionResponse> {
    const startTime = Date.now(); // Registra o tempo de início

    const { transactionId, reason } = request;

    // Buscar a transação
    const transaction = await this.transactionRepository.findById(
      transactionId,
    );

    if (!transaction) {
      this.logger.warn(`Transaction ${transactionId} not found.`);
      this.monitoringService.logTransactionStatus('failure'); // Transação não encontrada
      this.monitoringService.logReversalStatus('failure'); // Reversão falhou
      this.monitoringService.logTransactionDuration(
        'reverseTransaction',
        startTime,
      ); // Duração do processo
      return { reversal: null, error: new Error('Transaction not found') };
    }

    // Verificar se a transação pode ser revertida
    if (transaction.status === 'reversed') {
      this.logger.warn(
        `Transaction ${transactionId} has already been reversed.`,
      );
      this.monitoringService.logTransactionStatus('failure'); // Já revertida
      this.monitoringService.logReversalStatus('failure'); // Reversão falhou
      this.monitoringService.logTransactionDuration(
        'reverseTransaction',
        startTime,
      ); // Duração do processo
      return {
        reversal: null,
        error: new Error('Transaction has already been reversed'),
      };
    }

    if (transaction.status !== 'completed') {
      this.logger.warn(
        `Transaction ${transactionId} cannot be reversed, it is not completed.`,
      );
      this.monitoringService.logTransactionStatus('failure'); // Não pode ser revertida
      this.monitoringService.logReversalStatus('failure'); // Reversão falhou
      this.monitoringService.logTransactionDuration(
        'reverseTransaction',
        startTime,
      ); // Duração do processo
      return {
        reversal: null,
        error: new Error('Transaction cannot be reversed, it is not completed'),
      };
    }

    // Buscar os usuários envolvidos
    const sender = await this.userRepository.findById(transaction.senderId);
    const receiver = await this.userRepository.findById(transaction.receiverId);

    if (!sender || !receiver) {
      this.logger.warn(
        `User(s) involved not found. Sender: ${transaction.senderId}, Receiver: ${transaction.receiverId}`,
      );
      this.monitoringService.logTransactionStatus('failure'); // Usuários não encontrados
      this.monitoringService.logReversalStatus('failure'); // Reversão falhou
      this.monitoringService.logTransactionDuration(
        'reverseTransaction',
        startTime,
      ); // Duração do processo
      return { reversal: null, error: new Error('User(s) involved not found') };
    }

    // Reverter saldos
    sender.balance = sender.balance.plus(transaction.amount);
    receiver.balance = receiver.balance.minus(transaction.amount);

    // Salvar os novos saldos
    await this.userRepository.update(sender);
    await this.userRepository.update(receiver);

    // Criar a reversão
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
      this.monitoringService.logTransactionStatus('failure'); // Erro ao criar a reversão
      this.monitoringService.logReversalStatus('failure'); // Reversão falhou
      this.monitoringService.logTransactionDuration(
        'reverseTransaction',
        startTime,
      ); // Duração do processo
      return { reversal: null, error: reversalError };
    }

    // Salvar a reversão
    await this.reversalRepository.save(reversal);

    // Atualizar o status da transação
    transaction.status = 'reversed';
    await this.transactionRepository.update(transaction);

    this.logger.log(`Transaction ${transactionId} reversed successfully`);

    // Incrementa a métrica de sucesso e registra a duração
    this.monitoringService.logTransactionStatus('success'); // Sucesso na transação
    this.monitoringService.logReversalStatus('success'); // Sucesso na reversão
    this.monitoringService.logTransactionDuration(
      'reverseTransaction',
      startTime,
    ); // Duração do processo

    return { reversal, error: null }; // Sucesso
  }
}
