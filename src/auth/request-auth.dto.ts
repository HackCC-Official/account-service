import { IsEmail, IsStrongPassword } from "class-validator"

export class RequestSignInDTO {
    @IsEmail()
    email: string

    @IsStrongPassword()
    password: string
}
