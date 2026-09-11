import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { BET_STATUSES, type BetStatus, type ListBetsQuery } from '@ccscammers/shared';

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export class ListBetsQueryDto implements ListBetsQuery {
  @ApiPropertyOptional({ enum: BET_STATUSES })
  @IsOptional()
  @IsIn(BET_STATUSES)
  status?: BetStatus;

  @ApiPropertyOptional({ default: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ default: DEFAULT_PAGE_SIZE, maximum: MAX_PAGE_SIZE })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  take?: number;
}
