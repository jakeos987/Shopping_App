import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // נתיב ריק יחזיר את ה-Hello הרגיל
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health') // הוספנו את הנתיב לכאן
  @HttpCode(200)
  checkHealth() {
    return { status: 'OK', message: 'App is running smoothly!' };
  }
}