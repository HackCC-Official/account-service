import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, IsUUID } from "class-validator";
import { ResponseAccountDTO } from "src/account/response-account.dto";

export class ResponseTeamDTO {
  @IsUUID()
  @ApiProperty({
    example: '3e395b16-d9f8-4495-8375-92c700350d7c'
  })
  id: string;

  @IsString()
  @ApiProperty({
    example: 'Team Rocket'
  })
  name: string;

  @ApiProperty({
  })
  accounts: ResponseAccountDTO[];

  @IsDateString()
  @ApiProperty({
    example: "2025-01-30T07:03:08.307Z"
  })
  createdAt: string;
}