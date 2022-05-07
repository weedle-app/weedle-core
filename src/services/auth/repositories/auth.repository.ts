import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../common/base-classes/base-repository';
import { AuthEntity } from '../entities/auth.entity';
import * as bcrypt from 'bcrypt';

export interface IAuthRepository {
  getUserAuth(
    email: string,
    password: string,
  ): Promise<Partial<AuthEntity> | null>;
  createUserAuth(email: string, password: string): Promise<AuthEntity>;
  deleteUserAuth(user: AuthEntity): Promise<boolean>;
}

@EntityRepository(AuthEntity)
export default class AuthRepository
  extends BaseRepository<AuthEntity>
  implements IAuthRepository
{
  async getUserAuth(
    username: string,
    password: string,
  ): Promise<Partial<AuthEntity>> {
    const userAuth = await this.findOne({ email: username });
    const isPasswordValid = await bcrypt.compare(password, userAuth.password);
    if (userAuth && isPasswordValid) {
      const { email, accountVerified, id, ...rest } = userAuth;
      return {
        id,
        email,
        accountVerified,
      };
    }
    return null;
  }

  async verifyUserExists(email: string): Promise<boolean> {
    const userExists = await this.findOne({ email });
    return userExists != null;
  }

  async createUserAuth(email: string, password: string): Promise<AuthEntity> {
    return this.save({
      email,
      password,
    });
  }

  deleteUserAuth(user: AuthEntity): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
