import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return 'Final POS Backend is running! Visit /api for Swagger docs.';
  }
}
