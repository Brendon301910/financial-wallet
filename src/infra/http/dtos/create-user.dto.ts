import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 1000.75 })
  @Transform(({ value }) => new Decimal(value))
  balance: number;
}
