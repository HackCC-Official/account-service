import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
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

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '/apply/event',
        type: String
    })
    redirectTo: string;

    @IsBoolean()
    @ApiProperty({
    example: "false"
    })
    isJudging: boolean;
}
