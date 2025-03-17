import { Decimal } from 'decimal.js';

import { User } from './user.entity';

describe('User', () => {
  it('deve lançar um erro se o nome for menor que 3 caracteres', () => {
    const invalidUserProps = {
      name: 'Jo',
      email: 'john.doe@example.com',
      password: 'password123',
      balance: new Decimal(100),
    };

    const [user, error] = User.create(invalidUserProps);

    expect(error).toBeDefined();
    expect(error?.message).toBe('Name must have at least 3 characters');
  });

  it('deve lançar um erro se o email for inválido', () => {
    const invalidUserProps = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password123',
      balance: new Decimal(100),
    };

    const [user, error] = User.create(invalidUserProps);

    expect(error).toBeDefined();
    expect(error?.message).toBe('Invalid email format');
  });

  it('deve lançar um erro se a senha for menor que 6 caracteres', () => {
    const invalidUserProps = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '12345',
      balance: new Decimal(100),
    };

    const [user, error] = User.create(invalidUserProps);

    expect(error).toBeDefined();
    expect(error?.message).toBe('Password must have at least 6 characters');
  });

  it('deve lançar um erro se o saldo for negativo', () => {
    const invalidUserProps = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      balance: new Decimal(-100),
    };

    const [user, error] = User.create(invalidUserProps);

    expect(error).toBeDefined();
    expect(error?.message).toBe(
      'Balance must be greater than or equal to zero',
    );
  });

  it('deve criar o usuário se os dados forem válidos', () => {
    const validUserProps = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      balance: new Decimal(100),
    };

    const [user, error] = User.create(validUserProps);

    expect(user).toBeDefined();
    expect(error).toBeNull();
    expect(user?.name).toBe('John Doe');
    expect(user?.balance.toString()).toBe('100');
  });
});
