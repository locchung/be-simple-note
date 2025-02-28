import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Read token from Authorization header
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: config.secretKey,
    });
  }

  async validate(payload: { userId: string }) {
    return { userId: payload.userId }; // Attach user data to the request
  }
}
