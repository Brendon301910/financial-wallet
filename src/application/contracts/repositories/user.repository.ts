import { User } from 'domain/user.entity';

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract save(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract update(user: User): Promise<void>;
}
