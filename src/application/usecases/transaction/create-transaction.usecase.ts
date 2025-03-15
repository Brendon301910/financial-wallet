import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { IUserRepository } from 'application/contracts/repositories/user.repository';
import { ITransactionRepository } from 'application/contracts/repositories/transaction.repository';

import { Transaction } from 'domain/transaction.entity';
import {
  CreateTransactionRequest,
  CreateTransactionResponse,
  ICreateTransactionContract,
} from 'application/contracts/contracts/transaction.contract';

@Injectable()
export class CreateTransactionUseCase implements ICreateTransactionContract {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    request: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    // Buscar usuários
    const sender = await this.userRepository.findById(request.senderId);
    const receiver = await this.userRepository.findById(request.receiverId);

    if (!sender || !receiver) {
      return { transaction: null, error: new Error('User not found') };
    }

    // Validar saldo do remetente
    if (sender.balance.lt(request.amount)) {
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
      return { transaction: null, error };
    }

    // Atualizar saldos
    sender.balance = sender.balance.minus(request.amount);
    receiver.balance = receiver.balance.plus(request.amount);

    // Salvar no repositório
    await this.transactionRepository.save(transaction);
    await this.userRepository.update(sender);
    await this.userRepository.update(receiver);

    return { transaction, error: null };
  }
}
