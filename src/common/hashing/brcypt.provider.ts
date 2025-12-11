import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider extends HashingProvider {
  public async hashpassword(password: string | Buffer): Promise<string> {
    // generate salt
    const salt = await bcrypt.genSalt();
    // hash the password
    const hashPassword = await bcrypt.hash(password, salt);
    // return the hashed password
    return hashPassword;
  }

  public async comparePassword(
    password: string | Buffer,
    hashpassword: string | Buffer,
  ): Promise<boolean> {
    // compare the hashed passowrd with provider password
    const result = await bcrypt.compare(password, hashpassword.toString());
    // return matching password or not
    return result;
  }
}
