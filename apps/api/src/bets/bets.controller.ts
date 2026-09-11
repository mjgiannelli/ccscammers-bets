import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Bet, BetListResponse } from '@ccscammers/shared';

import { BetsService } from './bets.service';
import { CreateBetDto, ListBetsQueryDto, SettleBetDto, UpdateBetDto } from './dto';

@ApiTags('bets')
@Controller('bets')
export class BetsController {
  constructor(private readonly bets: BetsService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new bet.' })
  create(@Body() body: CreateBetDto): Promise<Bet> {
    return this.bets.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List bets, newest first.' })
  findAll(@Query() query: ListBetsQueryDto): Promise<BetListResponse> {
    return this.bets.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a single bet by document id.' })
  findOne(@Param('id') id: string): Promise<Bet> {
    return this.bets.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit an open bet.' })
  update(@Param('id') id: string, @Body() body: UpdateBetDto): Promise<Bet> {
    return this.bets.update(id, body);
  }

  @Patch(':id/settle')
  @ApiOperation({ summary: 'Settle an open bet as won, lost or void.' })
  settle(@Param('id') id: string, @Body() body: SettleBetDto): Promise<Bet> {
    return this.bets.settle(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a bet.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.bets.remove(id);
  }
}
