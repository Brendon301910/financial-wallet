import { z } from 'zod';
import { handleSafeParseZod } from '../lib/handleSafeParseZod';

export interface NotificationProps {
  id?: string;
  userId: string;
  transactionId?: string;
  reversalId?: string;
  message: string;
  read?: boolean;
  createdAt?: Date;
}

export class Notification {
  private _id?: string;
  private _userId: string;
  private _transactionId?: string;
  private _reversalId?: string;
  private _message: string;
  private _read: boolean;
  private _createdAt: Date;

  constructor(props: NotificationProps) {
    this.validate(props);
    this._id = props.id;
    this._userId = props.userId;
    this._transactionId = props.transactionId;
    this._reversalId = props.reversalId;
    this._message = props.message;
    this._read = props.read || false;
    this._createdAt = props.createdAt || new Date();
  }

  private validate(props: NotificationProps): void {
    const schema = z.object({
      userId: z.string().uuid('Invalid user ID'),
      transactionId: z.string().uuid().optional(),
      reversalId: z.string().uuid().optional(),
      message: z.string().min(5, 'Message must have at least 5 characters'),
      read: z.boolean().optional(),
      createdAt: z.date().optional(),
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

  public get transactionId(): string | undefined {
    return this._transactionId;
  }

  public get reversalId(): string | undefined {
    return this._reversalId;
  }

  public get message(): string {
    return this._message;
  }

  public get read(): boolean {
    return this._read;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  static create(props: NotificationProps): [Notification | null, Error | null] {
    try {
      return [new Notification(props), null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  static instance(
    props: NotificationProps,
  ): [Notification | null, Error | null] {
    return [new Notification(props), null];
  }
}
