import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '@repo/api/auth/dto/register-user.dto';
import { User } from '@repo/api/users/entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import DatabaseError from 'src/database/database-error.interface';
import PostgresError from 'src/database/postgres-error.enum';
import { UsersService } from 'src/users/users.service';
import TokenPayLoad from './token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registrationData: RegisterUserDto): Promise<User> {
    const hashedPassword = await bcryptjs.hash(registrationData.password, 10);

    const createdUser = await this.usersService
      .create({
        ...registrationData,
        password: hashedPassword,
      })
      .catch((error) => {
        const databaseError = error as DatabaseError;

        if (databaseError?.code === PostgresError.UniqueViolation) {
          throw new BadRequestException('User with that email already exists');
        }

        throw new InternalServerErrorException('Something went wrong');
      });

    return createdUser;
  }

  async getAuthUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);
      await this.verifyPassword(password, user.password);

      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  getCookieWithAccessJwtToken(userId: number) {
    const payload: TokenPayLoad = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });

    const cookie =
      `Authentication=${token};` +
      'HttpOnly;' +
      'Path=/;' +
      `Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')};`;

    return {
      cookie,
      token,
    };
  }

  getLogOutCookie() {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      `Refresh=; HttpOnly; Path=/auth/refresh; Max-Age=0`,
    ];
  }

  private async verifyPassword(
    plainText: string,
    hashed: string,
  ): Promise<boolean> {
    const isPasswordMatched = await bcryptjs.compare(plainText, hashed);

    if (!isPasswordMatched) {
      throw new BadRequestException('Wrong credentials provided');
    }

    return isPasswordMatched;
  }
}
