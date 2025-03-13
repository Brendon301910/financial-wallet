import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';
import { handleSafeParseZod } from '../lib/handleSafeParseZod';

export interface TransactionProps {
  id?: string;
  senderId: string;
  receiverId: string;
  amount: Decimal;
  status: 'pending' | 'completed' | 'reversed';
  createdAt?: Date;
}

export class Transaction {
  private _id?: string;
  private _senderId: string;
  private _receiverId: string;
  private _amount: Decimal;
  private _status: 'pending' | 'completed' | 'reversed';
  private _createdAt: Date;

  constructor(props: TransactionProps) {
    this.validate(props);
    this._id = props.id;
    this._senderId = props.senderId;
    this._receiverId = props.receiverId;
    this._amount = props.amount;
    this._status = props.status;
    this._createdAt = props.createdAt || new Date();
  }

  private validate(props: TransactionProps): void {
    const schema = z.object({
      senderId: z.string().uuid('Invalid sender ID'),
      receiverId: z.string().uuid('Invalid receiver ID'),
      amount: z
        .instanceof(Decimal)
        .refine((value) => value.gt(new Decimal(0)), {
          message: 'Amount must be greater than zero',
        }),
      status: z.enum(['pending', 'completed', 'reversed']),
      createdAt: z.date().optional(),
    });

    const result = schema.safeParse(props);

    if (!result.success) throw handleSafeParseZod(result);
  }

  public get id(): string | undefined {
    return this._id;
  }

  public get senderId(): string {
    return this._senderId;
  }

  public get receiverId(): string {
    return this._receiverId;
  }

  public get amount(): Decimal {
    return this._amount;
  }

  public get status(): 'pending' | 'completed' | 'reversed' {
    return this._status;
  }

  public set status(value: 'pending' | 'completed' | 'reversed') {
    this._status = value;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  static create(props: TransactionProps): [Transaction | null, Error | null] {
    try {
      return [new Transaction(props), null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  static instance(props: TransactionProps): [Transaction | null, Error | null] {
    return [new Transaction(props), null];
  }
}
