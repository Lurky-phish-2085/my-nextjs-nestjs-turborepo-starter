import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@repo/api/users/dto/create-user.dto';
import { User } from '@repo/api/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: number) {
    const user = await this.usersRepository
      .findOneByOrFail({ id })
      .catch((error) => {
        throw new NotFoundException('User with this id does not exist');
      });

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository
      .findOneByOrFail({ email })
      .catch((error) => {
        throw new NotFoundException('User with this email does not exist');
      });

    return user;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);

    return newUser;
  }
}
