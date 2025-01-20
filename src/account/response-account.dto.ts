import { IsArray, IsDateString, IsEmail, IsString } from "class-validator"

export class ResponseAccountDTO {
  @IsString()
  id: string;
  @IsEmail()
  email: string;
  @IsArray()
  roles: string;
  @IsDateString()
  createdAt: string;
}
