import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalysisService {
  /*
    1 - service para obter um relatório das matérias mais estudadas, menos estudadas e não estudadas durante um tempo de date1 até date2 (sendo date1 < date2)
    2 - service para obter uma lista em ordem das matérias com maior prioridade e, no entanto, menos estudados (se um item tem prioridade 9 e foi estudado 1 hora só na semana, por exemplo,
    um outro com prioridade 8 mas que não foi estudado nada deve vir acima), o qual recebe date1 e date2 também
  */

  constructor(private readonly prisma: PrismaService) {}

  // 1 - Matérias mais, menos e não estudadas no período
  async findMostStudiedSubjects({
    startDate,
    endDate,
    userId,
  }: {
    startDate?: Date;
    endDate?: Date;
    userId: string;
  }) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    // Define datas padrão se não vierem
    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setDate(now.getDate() - 7);

    const isValidDate = (date: Date) => !isNaN(date?.getTime());

    const usedStartDate = isValidDate(startDate) ? startDate : defaultStart;

    const usedEndDate = isValidDate(endDate) ? endDate : now;

    // Busca todas as matérias do usuário
    const subjects = await this.prisma.subject.findMany({
      where: { userId },
      select: {
        subjectId: true,
        title: true,
        priority: true,
        color: true,
      },
    });

    // Soma o tempo estudado por matéria no período
    const sessions = await this.prisma.studySession.groupBy({
      by: ['subjectId'],
      where: {
        userId,
        startDate: { gte: usedStartDate },
        endDate: { lte: usedEndDate },
      },
      _sum: { duration: true },
    });

    // Mapeia o tempo estudado para cada matéria
    const studyMap = new Map(
      sessions.map((s) => [s.subjectId, s._sum.duration || 0]),
    );

    // Junta os dados
    const result = subjects.map((subject) => ({
      ...subject,
      totalStudyTime: studyMap.get(subject.subjectId) || 0,
    }));

    // Ordena por tempo estudado (desc)
    const mostStudied = [...result].sort(
      (a, b) => b.totalStudyTime - a.totalStudyTime,
    );

    // Ordena por tempo estudado (asc)
    const leastStudied = [...result].sort(
      (a, b) => a.totalStudyTime - b.totalStudyTime,
    );

    // Matérias não estudadas
    const notStudied = result.filter((s) => s.totalStudyTime === 0);

    return {
      mostStudied,
      leastStudied,
      notStudied,
      startDate: usedStartDate,
      endDate: usedEndDate,
    };
  }

  // 2 - Matérias com maior prioridade e menos estudadas no período
  async findSubjectsToBeStudied({
    startDate,
    endDate,
    userId,
  }: {
    startDate?: Date;
    endDate?: Date;
    userId: string;
  }) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    // Define datas padrão se não vierem
    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setDate(now.getDate() - 7);

    const usedStartDate = isNaN(startDate?.getTime())
      ? defaultStart
      : startDate;

    const usedEndDate = isNaN(endDate?.getTime()) ? now : endDate;

    // Busca todas as matérias do usuário
    const subjects = await this.prisma.subject.findMany({
      where: { userId },
      select: {
        subjectId: true,
        title: true,
        priority: true,
        color: true,
      },
    });

    // Soma o tempo estudado por matéria no período
    const sessions = await this.prisma.studySession.groupBy({
      by: ['subjectId'],
      where: {
        userId,
        startDate: { gte: usedStartDate },
        endDate: { lte: usedEndDate },
      },
      _sum: { duration: true },
    });

    const studyMap = new Map(
      sessions.map((s) => [s.subjectId, s._sum.duration || 0]),
    );

    // Junta os dados
    const result = subjects.map((subject) => ({
      ...subject,
      totalStudyTime: studyMap.get(subject.subjectId) || 0,
    }));

    // Ordena por:
    // 1. Menor tempo estudado
    // 2. Maior prioridade
    const toBeStudied = [...result].sort((a, b) => {
      if (a.totalStudyTime === b.totalStudyTime) {
        return b.priority - a.priority;
      }
      return a.totalStudyTime - b.totalStudyTime;
    });

    return { ...toBeStudied, startDate: usedStartDate, endDate: usedEndDate };
  }
}
