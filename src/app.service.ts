import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): object {
    return {
      status: 'ok',
      message: 'Bounty API - Sistema de Recompensas',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  getInfo(): object {
    return {
      application: 'Bounty API',
      description: 'Sistema de gestión de recompensas',
      framework: 'NestJS',
      database: 'MongoDB',
    };
  }
}
