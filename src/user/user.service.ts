import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/common/hashing/hashing.provider';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationProvider: PaginationProvider,
    private readonly hashingProvider: HashingProvider,
    private readonly roleService: RoleService,
  ) {}

  private async checkValidRole(name: string) {
    let validRole: boolean | null = null;
    validRole = await this.roleService.checkRoleExist(name);

    if (!validRole) {
      throw new BadRequestException('Invalid role, This role does not exist');
    }

    return true;
  }

  public async checkUserExistByEmail(email: string) {
    let user: User | null = null;
    user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  public async findUserByEmail(email: string) {
    try {
      let user: User | null;
      user = await this.userRepository.findOne({
        where: { email },
        relations: { role: true },
      });

      if (!user) {
        throw new NotFoundException('User with this email does not exist');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async findUserById(id: number) {
    try {
      let user: User | null;
      user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User with this email does not exist');
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

      await this.checkValidRole(createUserDto.role.name);

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
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  findAll(paginationDto: PaginationDto) {
    return this.paginationProvider.paginateQuery(
      paginationDto,
      this.userRepository,
      undefined,
      ['role'],
    );
  }

  public async findOne(id: number) {
    const user = await this.userRepository.findBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);

    if (updateUserDto?.role?.name) {
      await this.checkValidRole(updateUserDto.role.name);
    }

    if (updateUserDto?.password) {
      updateUserDto.password = await this.hashingProvider.hashpassword(
        updateUserDto.password,
      );
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  public async remove(id: number) {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }
}
