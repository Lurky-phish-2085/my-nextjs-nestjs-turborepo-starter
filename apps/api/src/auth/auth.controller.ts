import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserDto } from '@repo/api/auth/dto/register-user.dto';
import { User } from '@repo/api/users/entities/user.entity';
import { Response } from 'express';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import JwtRefreshGuard from './jwt-refresh.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() registrationData: RegisterUserDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @AuthUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessTokenCookie = this.authService.getCookieWithAccessJwtToken(
      user.id,
    );
    const refreshTokenCookie = this.authService.getCookieWithRefreshJwtToken(
      user.id,
    );

    await this.usersService.setCurrentHashedRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );

    response.setHeader('Set-Cookie', [
      accessTokenCookie.cookie,
      refreshTokenCookie.cookie,
    ]);

    const { token: accessToken } = accessTokenCookie;
    const { token: refreshToken } = refreshTokenCookie;

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @AuthUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.usersService.removeRefreshToken(user.id);

    response.setHeader('Set-Cookie', this.authService.getLogOutCookie());
  }

  @UseGuards(JwtAuthGuard)
  @Get('authenticate')
  authenticate(@AuthUser() user: User) {
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(
    @AuthUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessTokenCookie = this.authService.getCookieWithAccessJwtToken(
      user.id,
    );

    response.setHeader('Set-Cookie', accessTokenCookie.cookie);

    const { token: accessToken } = accessTokenCookie;

    return {
      user,
      accessToken,
    };
  }
}
