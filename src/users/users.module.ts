import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
@Module({

  imports:[TypeOrmModule.forFeature([User]), AuthModule], 
  providers: [UsersService,JwtStrategy],
  controllers: [UsersController]
})
export class UsersModule {}
