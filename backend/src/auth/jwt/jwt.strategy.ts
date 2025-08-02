import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET! // dâu ! cam kết rằng biến mỗi trường không bao giờ là underfined 
    });
  }

  async validate(payload: any) {
    // payload là thông tin được mã hoá trong token
    return { id: payload.sub, email: payload.email };
  }
}
