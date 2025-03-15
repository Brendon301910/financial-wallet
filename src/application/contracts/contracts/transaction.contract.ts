import Decimal from 'decimal.js';
import { Transaction } from 'domain/transaction.entity';

export interface CreateTransactionRequest {
  senderId: string;
  receiverId: string;
  amount: Decimal;
}

export interface CreateTransactionResponse {
  transaction: Transaction | null;
  error: Error | null;
}

export abstract class ICreateTransactionContract {
  abstract execute(
    request: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse>;
}
