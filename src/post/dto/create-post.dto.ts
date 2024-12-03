import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostrDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsOptional()
  readonly images: string[];
}
