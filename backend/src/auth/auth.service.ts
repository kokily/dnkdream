import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import bcrypt from 'bcrypt';
import { Admin } from "./entities/admin.entity";
import { PasswordDto } from "./dto/password.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private admins: Repository<Admin>,
    private jwt: JwtService,
  ){}

  async register(dto: PasswordDto) {
    const count = await this.admins.count();

    if (count > 0) {
      throw new BadRequestException('관리자 계정이 이미 존재합니다.');
    }

    const password = await bcrypt.hash(dto.password, 10);
    await this.admins.save(this.admins.create({ password }));

    return {
      message: '관리자 계정 생성 완료',
    }
  }

  async login(dto: PasswordDto) {
    const [admin] = await this.admins.find({
      order: { id: 'ASC' },
      take: 1,
    });

    if (!admin) {
      throw new UnauthorizedException(
        '관리자 계정이 없습니다. register를 먼저 호출하세요.',
      );
    }

    const ok = await bcrypt.compare(dto.password, admin.password);

    if (!ok) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return {
      access_token: this.jwt.sign({ sub: admin.id }),
    };
  }
}