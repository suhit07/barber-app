import { classToClass } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

interface IRequest {
  user_id: string;
}

class ListProvidersService {
  constructor(
    private usersRepository: IUserRepository,
  ) {}

  public async execute(request: IRequest): Promise<User[]> {
    const { user_id } = request;
    // Remove cache logic, just fetch from repository
    const users = await this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });
    return users;
  }
}

export default ListProvidersService;
