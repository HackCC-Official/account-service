import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsString } from "class-validator"

export class RequestAccountDTO {
    @IsEmail()
    @ApiProperty({
        example: 'hacker@hackcc.net'
    })
    email: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'hackerman123'
    })
    username: string;
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
