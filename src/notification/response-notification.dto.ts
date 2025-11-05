import { ApiProperty } from "@nestjs/swagger";
import { ResponseTeamDTO } from "src/team/response-team.dto";
import { ResponseAccountDTO } from "src/account/response-account.dto";

export class ResponseNotificationDTO {
    @ApiProperty({
        example: '1dbfb98e-a53d-48b8-a9de-d22bfd353d76'
    })
    id: string;

    @ApiProperty({
        type: ResponseTeamDTO
    })
    team: ResponseTeamDTO;

    @ApiProperty({
        type: ResponseAccountDTO
    })
    account: ResponseAccountDTO;
}

