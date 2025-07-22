import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubjectModule } from './subject/subject.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SubjectModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
