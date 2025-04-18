import { IsOptional, IsString } from "class-validator";

export class APIQuery {
  @IsOptional()
  @IsString()
  q?: string;
}