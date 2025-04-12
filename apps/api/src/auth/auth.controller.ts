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
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
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

    response.setHeader('Set-Cookie', accessTokenCookie.cookie);

    const { token: accessToken } = accessTokenCookie;

    return {
      accessToken,
      authUser: user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @AuthUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.setHeader('Set-Cookie', this.authService.getLogOutCookie());
  }

  @UseGuards(JwtAuthGuard)
  @Get('authenticate')
  authenticate(@AuthUser() user: User) {
    return user;
  }
}
