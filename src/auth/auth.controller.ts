import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    const findUser = await this.userService.findByEmail(createUserDto.email);

    if (findUser) {
      throw new HttpException(
        'This user already exists',
        HttpStatus.CONFLICT,
      );
    }

    const user = (await this.userService.create(createUserDto)).toObject();

    await this.authService.sendVerificationEmail(
      user._id.toString(),
      user.email,
    );

    return { message: 'User registered. Please verify your email.' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Login successful.' };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth(@Request() req) {}

  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  async googleAuthRedirect(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.googleLogin(req);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return res.redirect('http://localhost:3000');
  }

  @Get('/verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      const result = await this.authService.verifyEmail(token);
      if (result) {
        return { message: 'Email successfully verified.' };
      }
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
