import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('인증 (Auth)')
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

  // JWT AuthGuard가 지키고 있는 테스트용 라우트
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 확인(토큰 테스트용)' })
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      message: '인증 성공',
      user: req.user,
    }
  }
}
