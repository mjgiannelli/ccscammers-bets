import { OmitType, PartialType } from '@nestjs/swagger';
import type { UpdateBetInput } from '@ccscammers/shared';

import { CreateBetDto } from './create-bet.dto';

/**
 * Everything on a bet is editable except who placed it, which is part of its
 * identity rather than its content.
 */
export class UpdateBetDto
  extends PartialType(OmitType(CreateBetDto, ['createdBy'] as const))
  implements UpdateBetInput {}
