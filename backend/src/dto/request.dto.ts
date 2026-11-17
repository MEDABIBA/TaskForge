import { IsNumber } from 'class-validator';
export class RequestDto {
  @IsNumber()
  userId: number;
}
