import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator"
import { AccountRoles } from "./role.enum";

export class ResponseAccountDTO {
  @IsUUID()
  @ApiProperty({
    example: "64ae0549-b038-44ce-aea4-089a50888290"
  })
  id: string;
  @IsEmail()
  @ApiProperty({
    example: 'hacker@hackcc.net'
  })
  email: string;
  @IsArray()
  @ApiProperty({
    example: '["USER", "ORGANIZER"]',
    type: [String]
  })
  @IsString()
  @ApiProperty({
      example: 'Hacker'
  })
  firstName: string;
  @IsString()
  @ApiProperty({
      example: 'Man'
  })
  lastName: string;
  @IsArray()
  @IsEnum(AccountRoles, { each: true })
  @ApiProperty({
      example: '["USER", "ORGANIZER"]',
      type: [String]
  })
  roles: AccountRoles[];
  @IsDateString()
  @ApiProperty({
    example: "2025-01-30T07:03:08.307Z"
  })
  createdAt: string;
}
