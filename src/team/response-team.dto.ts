import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, IsUUID } from "class-validator";

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

  @IsOptional()
  @ApiProperty({
    example: '["1dbfb98e-a53d-48b8-a9de-d22bfd353d76", "69d210eb-ac89-46e9-b690-fff90e8d2e59", "20136382-b5a6-447c-bcdc-a194b7adb0c6", "bc9a5e63-cf54-4cdb-95c2-3cffd91ff8e7"]',
    type: [String]
  })
  account_ids: string[];

  @IsDateString()
  @ApiProperty({
    example: "2025-01-30T07:03:08.307Z"
  })
  createdAt: string;
}