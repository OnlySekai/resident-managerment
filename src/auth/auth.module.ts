import { Global, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
@Global()
@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'JWT',
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
