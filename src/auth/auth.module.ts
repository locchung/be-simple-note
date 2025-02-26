import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { usersProviders } from 'src/users/users.providers';
import { DatabaseModule } from 'src/database/database.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'my_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    ...usersProviders,
    JwtStrategy
  ],
  controllers: [AuthController],
})
export class AuthModule {}
