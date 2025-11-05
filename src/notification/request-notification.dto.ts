import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class RequestNotificationDTO {
    @IsString()
    @ApiProperty({
        example: '72655936-896e-401a-b29a-32b13a833137',
        description: 'ID of the account being invited'
    })
    accountId: string;

    @IsUUID()
    @ApiProperty({
        example: '72655936-896e-401a-b29a-32b13a833137',
        description: 'Team ID to invite the user to'
    })
    teamId: string;
}

