import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(data: { username: string; email: string; password: string }) {
    const { username, email, password } = data;

    // Check if user already exists
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
    });

    // Return token
    const payload = { username: newUser.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: newUser,
    };
  }
}
