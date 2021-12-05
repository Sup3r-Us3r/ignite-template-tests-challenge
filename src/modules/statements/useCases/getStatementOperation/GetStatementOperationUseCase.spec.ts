import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe('GetStatementOperationUseCaseTest', () => {
  let usersRepository: InMemoryUsersRepository;
  let statementsRepository: InMemoryStatementsRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository,
    );
  });

  it('should be able show statement operation', async () => {
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

    const statementOperationResponse = await statementsRepository
      .create({
        user_id: String(userResponse.id),
        type: OperationType.DEPOSIT,
        description: 'Deposit description',
        amount: 100,
      });

    const response = await getStatementOperationUseCase
      .execute({
        user_id: String(userResponse.id),
        statement_id: String(statementOperationResponse.id),
      });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('user_id');
    expect(response).toHaveProperty('type');
    expect(response).toHaveProperty('amount');
  });
});
