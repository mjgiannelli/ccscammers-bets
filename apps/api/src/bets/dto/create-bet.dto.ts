import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import type { CreateBetInput } from '@ccscammers/shared';

export class CreateBetDto implements CreateBetInput {
  @ApiProperty({ example: 'Chiefs cover the spread' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Divisional round, -3.5', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiProperty({ example: 25, description: 'Amount risked, in whole currency units.' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(1_000_000)
  stake!: number;

  @ApiProperty({ example: 1.91, description: 'Decimal odds. Must be greater than 1.' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(1.0001)
  @Max(10_000)
  odds!: number;

  @ApiProperty({ example: 'mark' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  createdBy!: string;
}
