import { IsEnum, IsUUID, IsString, IsOptional } from 'class-validator';
import { MessageType } from '../entities/message.entity';

export class CreateMessageDto {
  @IsUUID()
  conversation_id: string;

  @IsUUID()
  sender_id: string;

  @IsEnum(MessageType)
  @IsOptional()
  message_type?: MessageType = MessageType.TEXT;

  @IsString()
  content: string;
}