import { IsArray, IsDateString, IsEmail, IsString, IsUUID } from "class-validator"

export class ResponseAccountDTO {
  @IsUUID()
  id: string;
  @IsEmail()
  email: string;
  @IsArray()
  roles: string;
  @IsDateString()
  createdAt: string;
}
