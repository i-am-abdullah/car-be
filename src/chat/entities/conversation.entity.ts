// src/chat/entities/conversation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CarListing } from 'src/car-listings/car-listing.entity';
import { User } from 'src/users/entities/user.entity';
import { Message } from './message.entity';

export enum ConversationStatus {
    ACTIVE = 'active',
    ARCHIVED = 'archived',
  }

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;

  @Column({ type: 'timestamp', nullable: true })
  first_message_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_message_at: Date;

  @Column({ type: 'integer', default: 0 })
  unread_count_buyer: number;

  @Column({ type: 'integer', default: 0 })
  unread_count_seller: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => CarListing, listing => listing.conversation, { nullable: false })
  @JoinColumn({ name: 'listing_id' })
  listing: CarListing;

  @ManyToOne(() => User, user => user.buyer, { nullable: false })
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @ManyToOne(() => User,user => user.seller, { nullable: false })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @OneToMany(() => Message, message => message.conversation)
  messages: Message[];
}
