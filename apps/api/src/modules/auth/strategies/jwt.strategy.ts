import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const cookie = request?.headers?.cookie
            ?.split(';')
            .map((part: string) => part.trim())
            .find((part: string) => part.startsWith('access_token='));
          return cookie ? decodeURIComponent(cookie.slice('access_token='.length)) : null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'change-this-secret',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) throw new UnauthorizedException();
    return {
      id: user.id,
      email: user.email,
      role: user.role?.name,
      roleId: user.roleId,
    };
  }
}