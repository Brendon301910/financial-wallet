import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';
import { handleSafeParseZod } from '../lib/handleSafeParseZod';

export interface ReversalProps {
  id?: string;
  transactionId: string;
  reason: string;
  createdAt?: Date;
}

export class Reversal {
  private _id?: string;
  private _transactionId: string;
  private _reason: string;
  private _createdAt: Date;

  constructor(props: ReversalProps) {
    this.validate(props);
    this._id = props.id;
    this._transactionId = props.transactionId;
    this._reason = props.reason;
    this._createdAt = props.createdAt || new Date();
  }

  private validate(props: ReversalProps): void {
    const schema = z.object({
      transactionId: z.string().uuid('Invalid transaction ID'),
      reason: z.string().min(5, 'Reason must have at least 5 characters'),
      createdAt: z.date().optional(),
    });

    const result = schema.safeParse(props);

    if (!result.success) throw handleSafeParseZod(result);
  }

  public get id(): string | undefined {
    return this._id;
  }

  public get transactionId(): string {
    return this._transactionId;
  }

  public get reason(): string {
    return this._reason;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  static create(props: ReversalProps): [Reversal | null, Error | null] {
    try {
      return [new Reversal(props), null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  static instance(props: ReversalProps): [Reversal | null, Error | null] {
    return [new Reversal(props), null];
  }
}
