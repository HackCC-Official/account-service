import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { AccountRoles } from "./role.enum";

export class RequestAccountDTO {
    @IsEmail()
    @ApiProperty({
        example: 'hacker@hackcc.net'
    })
    email: string;
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
    @IsEnum(AccountRoles, { each: true })
    @ApiProperty({
        example: '["USER", "ORGANIZER"]',
        type: [String]
    })
    roles: AccountRoles[];
}
