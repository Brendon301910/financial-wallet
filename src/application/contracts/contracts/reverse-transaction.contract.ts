import { Reversal } from 'domain/reversal.entity';

export interface ReverseTransactionRequest {
  transactionId: string;
  reason: string;
}

export interface ReverseTransactionResponse {
  reversal: Reversal | null;
  error: Error | null;
}

export abstract class IReverseTransactionContract {
  abstract execute(
    request: ReverseTransactionRequest,
  ): Promise<ReverseTransactionResponse>;
}
