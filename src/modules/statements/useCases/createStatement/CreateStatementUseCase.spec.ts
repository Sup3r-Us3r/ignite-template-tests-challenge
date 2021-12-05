import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe('CreateStatementUseCaseTest', () => {
  let usersRepository: InMemoryUsersRepository;
  let statementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository,
    );
  });

  it('should be able to create a new statement', async () => {
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

    const response = await createStatementUseCase
      .execute({
        user_id: String(userResponse.id),
        type: OperationType.DEPOSIT,
        description: 'Deposit description',
        amount: 100,
      });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('user_id');
    expect(response).toHaveProperty('type');
    expect(response).toHaveProperty('amount');
  });

  it('should not be able to create a new statement when type is withdraw and balance is insufficient', () => {
    expect(async () => {
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

      await createStatementUseCase
        .execute({
          user_id: String(userResponse.id),
          type: OperationType.WITHDRAW,
          description: 'Withdraw description',
          amount: 100,
        });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
