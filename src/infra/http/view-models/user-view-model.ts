import { User } from 'domain/user.entity';

export class UserViewModel {
  static toHttp(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      balance: user.balance,
      password: user.password,
    };
  }
}
