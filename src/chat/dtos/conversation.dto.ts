import { ConversationStatus } from '../entities/conversation.entity';

export class ConversationDto {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  status: ConversationStatus;
  first_message_at: Date;
  last_message_at: Date;
  unread_count_buyer: number;
  unread_count_seller: number;
  created_at: Date;
  updated_at: Date;
  
  // Include nested objects as needed
  listing?: {
    id: string;
    make: { name: string };
    model: { name: string };
    year: { year: number };
  };
  
  last_message?: {
    content: string;
    created_at: Date;
    sender_id: string;
  };
}