import { IsArray, IsDateString, IsEmail, IsString } from "class-validator"

export class RequestAccountDTO {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
    @IsArray()
    roles: string;
}
