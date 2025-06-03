import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import { User, UserDocument } from '@modules/users/schemas/UserSchema';

class UsersRepository implements IUserRepository {
  private ormRepository = User;

  public async create(createData: ICreateUserDTO): Promise<UserDocument> {
    const { email, name, password } = createData;

    const user = await this.ormRepository.create({ email, name, password });

    return user;
  }

  public async save(user: UserDocument): Promise<UserDocument> {
    await user.save();
    return user;
  }

  public async findById(id: string): Promise<UserDocument | null> {
    const user = await this.ormRepository.findById(id);

    return user;
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.ormRepository.findOne({ email });

    return user;
  }

  public async findAllProviders(data: IFindAllProvidersDTO): Promise<UserDocument[]> {
    const filter = data.except_user_id ? { _id: { $ne: data.except_user_id } } : {};
    const users = await this.ormRepository.find(filter).select('id email name created_at updated_at avatar');

    return users;
  }
}

export default UsersRepository;
