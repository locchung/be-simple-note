import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async signUp(email: string, password: string, userName: string) {
    // check if user already exists
    const existingUser = await this.userService.findUser(email);
    if (existingUser) throw new UnauthorizedException('User email already exists');

    // check if user already exists
    const existingUserName = await this.userService.findUser(userName);
    if (existingUserName) throw new UnauthorizedException('User name already exists');

    // generate password
    const salt = await bcrypt.genSalt(6);
    const encrypted = await bcrypt.hash(password, salt);

    const user: CreateUserDto = {
      username: userName,
      salt,
      email,
      password: encrypted,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const newUser = await this.userService.create(user);
    return { userId: newUser._id, email: newUser.email, username: newUser.username };
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findUser(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    await this.userService.update(user._id as string, {
      last_login: new Date(),
      updated_at: new Date()
    });

    const token = this.jwtService.sign({ userId: user._id });
    const refreshToken = this.jwtService.sign({ userId: user._id }, { expiresIn: '7d' });
    return { accessToken: token, refreshToken, userId: user._id, email: user.email };
  }

  async refreshToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken);
    if (!decoded) throw new UnauthorizedException('Invalid token');

    const user = await this.userService.findOne(decoded.userId);
    if (!user) throw new UnauthorizedException('Invalid token');

    const token = this.jwtService.sign({ userId: user._id });
    return { accessToken: token, userId: user._id, email: user.email };
  }
}
