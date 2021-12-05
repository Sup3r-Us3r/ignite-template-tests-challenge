import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe('GetBalanceUseCaseTest', () => {
  let usersRepository: InMemoryUsersRepository;
  let statementsRepository: InMemoryStatementsRepository;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository,
    );
  });

  it('should be able to list a balance by user', async () => {
    const userData = {
      name: 'User',
      email: 'user@mail.com',
      password: '123456',
    };

    const userResponse = await usersRepository.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    const response = await getBalanceUseCase
      .execute({
        user_id: String(userResponse.id),
      });

    expect(response).toHaveProperty('statement');
    expect(response).toHaveProperty('balance');
    expect(response.balance).toBe(0);
  });
});
