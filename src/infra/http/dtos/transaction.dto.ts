import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';

export class CreateTransactionDto {
  @ApiProperty({
    example: '9e0dc80c-1cfe-44db-a172-4ee10a8f7b66',
  })
  senderId: string;

  @ApiProperty({
    example: '9e0dc80c-1cfe-44db-a172-4ee10a8f7b66',
  })
  receiverId: string;

  @ApiProperty({ example: 100.5 })
  @Transform(({ value }) => new Decimal(value))
  amount: Decimal;
}
