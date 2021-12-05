import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe('ShowUserProfileUseCaseTest', () => {
  let usersRepository: InMemoryUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able show user profile data', async () => {
    const userResponse = await usersRepository.create({
      email: 'user@mail.com',
      name: 'User',
      password: '123456',
    });

    const response = await showUserProfileUseCase
      .execute(String(userResponse.id));

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('email');
    expect(response).toHaveProperty('name');
  });
});
