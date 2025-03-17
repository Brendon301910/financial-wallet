import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateReversalDto {
  @ApiProperty({
    example: '5e0dc80c-1cfe-44db-a172-4ee10a8f7b66', // Exemplo realista de UUID
  })
  transactionId: string;

  @ApiProperty({ example: 'Fraudulent transaction' }) // Exemplo de motivo da reversão
  reason: string;
}
