import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';
import { handleSafeParseZod } from '../lib/handleSafeParseZod';

export interface WalletProps {
  id?: string;
  userId: string;
  balance: Decimal;
}

export class Wallet {
  private _id?: string;
  private _userId: string;
  private _balance: Decimal;

  constructor(props: WalletProps) {
    this.validate(props);
    this._id = props.id;
    this._userId = props.userId;
    this._balance = props.balance;
  }

  private validate(props: WalletProps): void {
    const schema = z.object({
      userId: z.string().uuid('Invalid user ID'),
      balance: z
        .instanceof(Decimal)
        .refine((value) => value.gte(new Decimal(0)), {
          message: 'Balance must be greater than or equal to zero',
        }),
    });

    const result = schema.safeParse(props);

    if (!result.success) throw handleSafeParseZod(result);
  }

  public get id(): string | undefined {
    return this._id;
  }

  public get userId(): string {
    return this._userId;
  }

  public get balance(): Decimal {
    return this._balance;
  }

  public set balance(value: Decimal) {
    if (value.lt(new Decimal(0))) {
      throw new Error('Balance cannot be negative');
    }
    this._balance = value;
  }

  static create(props: WalletProps): [Wallet | null, Error | null] {
    try {
      return [new Wallet(props), null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  static instance(props: WalletProps): [Wallet | null, Error | null] {
    return [new Wallet(props), null];
  }
}
