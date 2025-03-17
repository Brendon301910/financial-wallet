import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICreateTransactionContract } from 'application/contracts/contracts/transaction.contract';

import { TransactionViewModel } from '../view-models/transaction.view-model';
import { Transaction } from 'domain/transaction.entity';
import Decimal from 'decimal.js';
import { CreateTransactionDto } from '../dtos/transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private createTransaction: ICreateTransactionContract) {}

  @ApiOperation({ summary: 'Create a new Transaction' })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionViewModel,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or insufficient balance',
  })
  async create(@Body() body: CreateTransactionDto) {
    const { senderId, receiverId, amount } = body;

    const amountDecimal = new Decimal(amount);

    const [transaction, error] = Transaction.create({
      senderId,
      receiverId,
      amount: amountDecimal,
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

    const response = await this.createTransaction.execute({
      senderId,
      receiverId,
      amount: new Decimal(amount),
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

    return new TransactionViewModel(response.transaction!);
  }
}
