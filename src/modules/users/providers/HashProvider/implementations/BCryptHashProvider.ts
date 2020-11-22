import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import { hash, compare } from 'bcryptjs';

export default class BcryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    /**
     * Define hash da senha, passando hash e tamanho do 'salt' que sera utilizado
     * Ref: https://en.wikipedia.org/wiki/Salt_(cryptography)
     */
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
