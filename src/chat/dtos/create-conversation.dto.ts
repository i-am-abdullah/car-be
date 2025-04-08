// src/chat/dto/create-conversation.dto.ts
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  @IsNotEmpty()
  listing_id: string;

  @IsUUID()
  @IsNotEmpty()
  buyer_id: string;
}
