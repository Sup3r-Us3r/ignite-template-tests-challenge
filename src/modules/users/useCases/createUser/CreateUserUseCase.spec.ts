import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe('CreateUserUseCaseTest', () => {
  let usersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able create a new user', async () => {
    const response = await createUserUseCase.execute({
      email: 'user@mail.com',
      name: 'User',
      password: '123456',
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('email');
    expect(response).toHaveProperty('name');
  });

  it('should not be able to create a new user if it already exists', () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: 'user@mail.com',
        name: 'User',
        password: '123456',
      });

      await createUserUseCase.execute({
        email: 'user@mail.com',
        name: 'User',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
