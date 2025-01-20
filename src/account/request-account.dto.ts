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
    @IsDateString()
    createdAt: string;
    @IsArray()
    loggedInAt: string[];
}
