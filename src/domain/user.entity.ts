import Decimal from 'decimal.js';
import { handleSafeParseZod } from 'src/lib/handleSafeParseZod';
import { z } from 'zod';

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  balance: Decimal;
}
export class User {
  private _id?: string;
  private _name: string;
  private _email: string;
  private _password: string;
  private _balance: Decimal;

  constructor(props: UserProps) {
    this.validate(props);
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._balance = props.balance;
  }

  private validate(props: UserProps): void {
    const schema = z.object({
      name: z.string().min(3, 'Name must have at least 3 characters'),
      email: z.string().email('Invalid email format'),
      password: z.string().min(6, 'Password must have at least 6 characters'),
      balance: z
        .instanceof(Decimal, {
          message: 'Balance must be a valid Decimal instance',
        })
        .refine((decimalValue) => decimalValue.gte(new Decimal(0)), {
          message: 'Balance must be greater than or equal to zero',
        }),
    });

    const result = schema.safeParse(props);

    if (!result.success) throw handleSafeParseZod(result);
  }

  public get id(): string {
    return this._id;
  }
  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    if (value.length < 3) {
      throw new Error('Name must have at least 3 characters');
    }
    this._name = value;
  }

  public get email(): string {
    return this._email;
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    if (value.length < 6) {
      throw new Error('Password must have at least 6 characters');
    }
    this._password = value;
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

  static create(props: UserProps): [User | null, Error | null] {
    try {
      return [new User(props), null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  static instance(props: UserProps): [User | null, Error | null] {
    return [new User(props), null];
  }
}
