import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { PasswordDto } from "./dto/password.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: PasswordDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: PasswordDto) {
    return this.auth.login(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Request() req: { user: { id: number } }) {
    return {
      admin: req.user,
    }
  }
}