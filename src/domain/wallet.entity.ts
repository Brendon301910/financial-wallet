import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';
import { handleSafeParseZod } from '../lib/handleSafeParseZod';

export interface WalletProps {
  id?: string;
  userId: string;
}

export class Wallet {
  private _id?: string;
  private _userId: string;

  constructor(props: WalletProps) {
    this.validate(props);
    this._id = props.id;
    this._userId = props.userId;
  }

  private validate(props: WalletProps): void {
    const schema = z.object({
      userId: z.string().uuid('Invalid user ID'),
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
