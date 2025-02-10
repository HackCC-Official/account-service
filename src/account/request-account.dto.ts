import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsEmail, IsString } from "class-validator"

export class RequestAccountDTO {
    @IsEmail()
    @ApiProperty({
        example: 'hacker@hackcc.net'
    })
    email: string;
    @IsString()
    @ApiProperty({
        example: 'password'
    })
    password: string;
    @IsArray()
    @ApiProperty({
        example: '["USER", "ORGANIZER"]',
        type: [String]
    })
    roles: string;
}
