import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // [POST] /api/auth/register : 최초 계정 생성
  @Post('register')
  registerAdmin(@Body() body: AuthDto) {
    return this.authService.registerAdmin(body);
  }

  // [POST] /api/auth/login : 로그인
  @Post('login')
  login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }
}
