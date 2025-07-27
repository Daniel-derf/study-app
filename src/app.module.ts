import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubjectModule } from './subject/subject.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GuardModule } from './guard/guard.module';

@Module({
  imports: [SubjectModule, AuthModule, UserModule, GuardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
