import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Admin } from "./entities/admin.entity";
import { Repository } from "typeorm";

export interface JwtPayload {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(Admin) private admins: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') ?? '',
    });
  }

  async validate(payload: JwtPayload) {
    const admin = await this.admins.findOne({
      where: {
        id: payload.sub,
      }
    });

    if (!admin) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return {
      id: admin.id,
    }
  }
}