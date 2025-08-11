import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SubjectModule } from './subject/subject.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainExceptionFilter } from './common/domain-exception.filter';
import { AnalysisModule } from './analysis/analysis.module';
import { StudySessionModule } from './study-session/study-session.module';

@Module({
  imports: [
    AuthModule,
    SubjectModule,
    UserModule,
    AnalysisModule,
    StudySessionModule,
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AppModule {}
