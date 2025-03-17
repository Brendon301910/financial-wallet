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

@Injectable()
export class ReverseTransactionUseCase implements IReverseTransactionContract {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userRepository: IUserRepository,
    private readonly reversalRepository: IReversalRepository, // Repositório para reversão
  ) {}

  async execute(
    request: ReverseTransactionRequest,
  ): Promise<ReverseTransactionResponse> {
    const { transactionId, reason } = request;

    // Buscar a transação
    const transaction = await this.transactionRepository.findById(
      transactionId,
    );

    if (!transaction) {
      return { reversal: null, error: new Error('Transaction not found') };
    }

    // Verificar se a transação pode ser revertida
    if (transaction.status === 'reversed') {
      return {
        reversal: null,
        error: new Error('Transaction has already been reversed'),
      };
    }

    if (transaction.status !== 'completed') {
      return {
        reversal: null,
        error: new Error('Transaction cannot be reversed, it is not completed'),
      };
    }

    // Buscar os usuários envolvidos
    const sender = await this.userRepository.findById(transaction.senderId);
    const receiver = await this.userRepository.findById(transaction.receiverId);

    if (!sender || !receiver) {
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
      return { reversal: null, error: reversalError };
    }

    // Salvar a reversão
    await this.reversalRepository.save(reversal);

    // Atualizar o status da transação
    transaction.status = 'reversed';
    await this.transactionRepository.update(transaction);

    return { reversal, error: null }; // Sucesso
  }
}
