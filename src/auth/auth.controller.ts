import { BadRequestException, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(data: AuthDto) {
    try {
      await this.authService.signin(data);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('signup')
  async signup(data: AuthDto) {
    try {
      await this.authService.signup(data);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
