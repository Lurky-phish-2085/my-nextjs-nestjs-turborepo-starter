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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { LoginUserDto } from '@repo/api/auth/dto/login-user.dto';
import { RegisterUserDto } from '@repo/api/auth/dto/register-user.dto';
import { RegisterUserResponseDto } from '@repo/api/auth/dto/register-user.response.dto';
import { DefaultExceptionResponse } from '@repo/api/types/default-exception-response.type';
import { User } from '@repo/api/users/entities/user.entity';
import { Response } from 'express';
import { ApiUnauthorizedResponse } from 'src/common/decorators/ApiUnauthorizedResponse.decorator';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login.response.dto';
import { RefreshResponseDto } from './dto/refresh.response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiCreatedResponse({ type: RegisterUserResponseDto })
  register(@Body() registrationData: RegisterUserDto) {
    return this.authService.register(registrationData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  @ApiBadRequestResponse({
    type: DefaultExceptionResponse,
    example: {
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'Wrong credentials provided',
    },
  })
  @ApiOkResponse({
    type: LoginResponseDto,
    example: {
      accessToken: 'token',
      refreshToken: 'token',
      user: {
        email: 'user@user.com',
        id: 1,
        name: 'user',
      },
    },
    headers: {
      'Set-Cookie': {
        description:
          'Sets cookies containing access and refresh token value in the client browser',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async login(
    @AuthUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiUnauthorizedResponse()
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description:
          'Sets a cookie in the client browser to clear out both authentication and refresh tokens',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async logout(
    @AuthUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.usersService.removeRefreshToken(user.id);

    response.setHeader('Set-Cookie', this.authService.getLogOutCookie());
  }

  @Get('authenticate')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: User })
  authenticate(@AuthUser() user: User) {
    return user;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiSecurity('refresh-token')
  @ApiUnauthorizedResponse()
  @ApiOkResponse({
    type: RefreshResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'Sets a new access token cookie in the client browser',
        schema: {
          type: 'string',
        },
      },
    },
  })
  refresh(
    @AuthUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): RefreshResponseDto {
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
