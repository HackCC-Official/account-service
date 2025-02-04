import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestSignInDTO } from './request-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: RequestSignInDTO){
        return this.authService.signIn(signInDto.email, signInDto.password)
    }


    
}
