import Decimal from 'decimal.js';
import { User } from 'domain/user.entity';

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  balance: Decimal;
}

export interface CreateUserResponse {
  user: User | null;
  error: Error | null;
}

export abstract class ICreateUserContract {
  abstract execute(request: CreateUserRequest): Promise<CreateUserResponse>;
}
