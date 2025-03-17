import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IReverseTransactionContract } from 'application/contracts/contracts/reverse-transaction.contract';

import { Reversal } from 'domain/reversal.entity';
import { ReversalViewModel } from '../view-models/reverse-transaction.view-model';
import { CreateReversalDto } from '../dtos/reverse-transaction.dto';

@ApiTags('Reversals')
@Controller('reversals')
export class ReversalController {
  constructor(private createReversal: IReverseTransactionContract) {}

  @ApiOperation({ summary: 'Create a new Reversal' })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Reversal created successfully',
    type: ReversalViewModel,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or transaction not found',
  })
  async create(@Body() body: CreateReversalDto) {
    const { transactionId, reason } = body;

    const [reversal, error] = Reversal.create({
      transactionId,
      reason,
    });

    if (error) {
      throw new HttpException(
        {
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await this.createReversal.execute({
      transactionId,
      reason,
    });

    if (response.error) {
      throw new HttpException(
        {
          message: response.error.message,
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return new ReversalViewModel(response.reversal!);
  }
}
