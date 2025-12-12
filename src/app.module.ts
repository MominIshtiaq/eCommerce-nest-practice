import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidation } from './config/env.validation';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import databaseConfig from './config/database.config';

const ENV_MODE = process.env.ENV_MODE;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        ENV_MODE === 'production' ? '.env' : `.env.${ENV_MODE?.trim()}`,
      load: [databaseConfig],
      validationSchema: envValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('databaseConfig.host'),
        port: configService.get('databaseConfig.port'), // this must be a number
        username: configService.get('databaseConfig.username'),
        password: configService.get('databaseConfig.password'),
        database: configService.get('databaseConfig.database'),
        autoLoadEntities: configService.get('databaseConfig.autoLoadEntities'),
        synchronize: configService.get('databaseConfig.synchronize'),
      }),
    }),
    UserModule,
    AuthModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
