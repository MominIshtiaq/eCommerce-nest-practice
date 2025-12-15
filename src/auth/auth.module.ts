import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import authConfigurations from './config/auth.config';
import { HashingModule } from 'src/common/hashing/hashing.module';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthorizeGuard } from './guard/authorize.guard';

@Module({
  imports: [
    UserModule,
    ConfigModule.forFeature(authConfigurations),
    JwtModule.registerAsync(authConfigurations.asProvider()),
    HashingModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthorizeGuard,
    // },
  ],
  exports: [AuthService],
})
export class AuthModule {}
