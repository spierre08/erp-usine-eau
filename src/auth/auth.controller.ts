import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Roles } from './decorator/role.decorator';
import { Role } from './enum/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
  
  @Roles(Role.ADMIN, Role.COMPTABLE)
  @Patch('update-password/:id')
  async updatePassword(@Param('id') id: string, @Body() data: UpdatePasswordDto) {
    return this.authService.updatePassword(id, data.password);
  }
}
