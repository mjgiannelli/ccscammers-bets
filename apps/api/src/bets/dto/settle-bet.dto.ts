import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import {
  SETTLED_BET_STATUSES,
  type SettleBetInput,
  type SettledBetStatus,
} from '@ccscammers/shared';

export class SettleBetDto implements SettleBetInput {
  @ApiProperty({ enum: SETTLED_BET_STATUSES, example: 'won' })
  @IsIn(SETTLED_BET_STATUSES)
  status!: SettledBetStatus;
}
