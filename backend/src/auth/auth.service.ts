import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registerAdmin(body: AuthDto) {
    const existingAdmin = await this.userRepository.findOne({
      where: { username: body.username },
    });

    if (existingAdmin) {
      throw new BadRequestException('이미 존재하는 계정입니다.');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const admin = this.userRepository.create({
      username: body.username,
      password: hashedPassword,
    });

    await this.userRepository.save(admin);

    return {
      message: '관리자 계정이 생성되었습니다.',
    };
  }

  async login(body: AuthDto) {
    const user = await this.userRepository.findOne({
      where: { username: body.username },
    });

    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 틀렸습니다.');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 틀렸습니다.');
    }

    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
