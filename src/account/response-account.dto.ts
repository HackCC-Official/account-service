import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator"

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
  roles: string;
  @IsDateString()
  @ApiProperty({
    example: "2025-01-30T07:03:08.307Z"
  })
  createdAt: string;
}
