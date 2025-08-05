import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalysisService {
  /*
    1 - service para obter um relatório das matérias mais estudados, menos estudados e não estudados durante um tempo de date1 até date2 (sendo date1 < date2)
    2 - service para obter uma lista em ordem das matérias com maior prioridade e, no entanto, menos estudados (se um item tem prioridade 9 e foi estudado 1 hora só na semana, por exemplo,
    um outro com prioridade 8 mas que não foi estudado nada deve vir acima), o qual recebe date1 e date2 também
  */

  constructor(private readonly prisma: PrismaService) {}

  async findMostStudiedSubjects({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) {}

  async findSubjectsToBeStudied({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) {}
}
