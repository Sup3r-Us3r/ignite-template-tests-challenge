import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

describe('AuthenticateUserUseCaseTest', () => {
  let usersRepository: InMemoryUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it('should be able to authenticate a user', async () => {
    const userData = {
      name: 'User',
      email: 'user@mail.com',
      password: '123456',
    };

    await usersRepository.create({
      name: userData.name,
      email: userData.email,
      password: await hash(userData.password, 6),
    });

    const response = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password,
    });

    expect(response).toMatchObject({
      user: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
      },
    });
    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate a user if password is wrong', () => {
    expect(async () => {
      await usersRepository.create({
        name: 'User',
        email: 'user@mail.com',
        password: await hash('123456', 6),
      });

      await authenticateUserUseCase.execute({
        email: 'user@mail.com',
        password: 'xxxxxx',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
