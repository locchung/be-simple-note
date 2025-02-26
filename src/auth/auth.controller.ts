import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto.email, createUserDto.password, createUserDto.username);
  }

  @Post('signin')
  async signIn(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.signIn(email, password);
  }
}
