import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SubjectModule } from './subject/subject.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [SubjectModule, AuthModule, UserModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
