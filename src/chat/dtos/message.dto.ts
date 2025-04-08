import { MessageType } from '../entities/message.entity';

export class MessageDto {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: MessageType;
  content: string;
  is_read: boolean;
  is_deleted: boolean;
  created_at: Date;
  
  // Include additional user information
  sender?: {
    id: string;
    username: string;
    profile_picture_url?: string;
  };
}