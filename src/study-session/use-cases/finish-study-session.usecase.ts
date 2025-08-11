import { Injectable } from '@nestjs/common';

@Injectable()
export class FinishStudySessionUseCase {
  constructor(private readonly sessionRepository) {}
}
