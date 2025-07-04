import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // khóa bí mật để ký token
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1h' }, // thời gian hết hạn của token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
