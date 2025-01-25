import { IsArray, IsDateString, IsEmail, IsString } from "class-validator"

export class RequestAccountDTO {
    @IsString()
    id: string;
    @IsEmail()
    email: string;
    @IsString()
    password: string;
    @IsArray()
    roles: string;
}
