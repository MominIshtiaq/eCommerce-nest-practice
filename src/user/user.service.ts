import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/common/hashing/hashing.provider';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationProvider: PaginationProvider,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async checkUserExistByEmail(email: string) {
    let user: User | null = null;
    user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  public async findUserByEmail(email: string) {
    try {
      let user: User | null;
      user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new BadRequestException('User with this email does not exist');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async create(createUserDto: CreateUserDto) {
    try {
      const checkUser = await this.checkUserExistByEmail(createUserDto.email);

      if (checkUser) {
        throw new BadRequestException('User with this email already exists!!!');
      }

      const user = this.userRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashpassword(
          createUserDto.password,
        ),
      });
      await this.userRepository.save(user);

      return {
        data: user,
        message: 'User created Successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findAll(paginationDto: PaginationDto) {
    return this.paginationProvider.paginateQuery(
      paginationDto,
      this.userRepository,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
