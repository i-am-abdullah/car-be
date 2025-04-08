import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, ConversationStatus } from './entities/conversation.entity';
import { Message, MessageType } from './entities/message.entity';
import { CreateConversationDto } from './dtos/create-conversation.dto';
import { CreateMessageDto } from './dtos/create-message.dto';
import { ConversationDto } from './dtos/conversation.dto';
import { MessageDto } from './dtos/message.dto';
import { CarListing } from 'src/car-listings/car-listing.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(CarListing)
    private carListingRepository: Repository<CarListing>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllConversationsForUser(userId: string): Promise<ConversationDto[]> {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.listing', 'listing')
      .leftJoinAndSelect('listing.make', 'make')
      .leftJoinAndSelect('listing.model', 'model')
      .leftJoinAndSelect('listing.year', 'year')
      .leftJoinAndSelect('conv.buyer', 'buyer')
      .leftJoinAndSelect('conv.seller', 'seller')
      .where('buyer.id = :userId OR seller.id = :userId', { userId })
      .orderBy('conv.last_message_at', 'DESC')
      .getMany();

    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await this.messageRepository
          .createQueryBuilder('msg')
          .where('msg.conversation = :convId', { convId: conversation.id })
          .orderBy('msg.created_at', 'DESC')
          .getOne();
          console.log(lastMessage);
          

        return {
          id: conversation.id,
          listing_id: conversation.listing.id,
          buyer_id: conversation.buyer.id,
          seller_id: conversation.seller.id,
          status: conversation.status,
          first_message_at: conversation.first_message_at,
          last_message_at: conversation.last_message_at,
          unread_count_buyer: conversation.unread_count_buyer,
          unread_count_seller: conversation.unread_count_seller,
          listing: conversation.listing,
          buyer: conversation.buyer,
          seller: conversation.seller,
          created_at: conversation.created_at,
          updated_at: conversation.updated_at,
          last_message: lastMessage ? {
            content: lastMessage.content,
            created_at: lastMessage.created_at,
            sender_id: lastMessage.id,
          } : null,
        } as ConversationDto;
      }),
    );

    return conversationsWithLastMessage;
  }

  async getConversationById(id: string): Promise<ConversationDto> {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.listing', 'listing')
      .leftJoinAndSelect('listing.make', 'make')
      .leftJoinAndSelect('listing.model', 'model')
      .leftJoinAndSelect('listing.year', 'year')
      .leftJoinAndSelect('conv.buyer', 'buyer')
      .leftJoinAndSelect('conv.seller', 'seller')
      .where('conv.id = :id', { id })
      .getOne();

    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${id} not found`);
    }

    // Convert to DTO format
    return {
      id: conversation.id,
      listing_id: conversation.listing.id,
      buyer_id: conversation.buyer.id,
      seller_id: conversation.seller.id,
      status: conversation.status,
      first_message_at: conversation.first_message_at,
      last_message_at: conversation.last_message_at,
      unread_count_buyer: conversation.unread_count_buyer,
      unread_count_seller: conversation.unread_count_seller,
      listing: conversation.listing,
      buyer: conversation.buyer,
      seller: conversation.seller,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
    } as ConversationDto;
  }

  

  async findOrCreateConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<ConversationDto> {
    const { listing_id, buyer_id } = createConversationDto;

    // Fetch the listing to get the seller_id
    const listing = await this.carListingRepository.findOne({
      where: { id: listing_id },
      relations: ['user'],
    });

    if (!listing) {
      throw new NotFoundException(`Listing with id ${listing_id} not found`);
    }

    const seller_id = listing.user.id;
    console.log(seller_id, buyer_id, "IDS");
    

    if (buyer_id === seller_id) {
      throw new BadRequestException('Buyer and seller cannot be the same user');
    }

    // Find the buyer and seller user entities
    const buyer = await this.userRepository.findOne({
      where: { id: buyer_id },
    });
    
    if (!buyer) {
      throw new NotFoundException(`Buyer with id ${buyer_id} not found`);
    }
    
    const seller = await this.userRepository.findOne({
      where: { id: seller_id },
    });
    
    if (!seller) {
      throw new NotFoundException(`Seller with id ${seller_id} not found`);
    }

    // Check if a conversation already exists
    let conversation = await this.conversationRepository.findOne({
      where: {
        listing: { id: listing_id },
        buyer: { id: buyer_id },
        seller: { id: seller_id },
      },
      relations: ['listing', 'buyer', 'seller'],
    });

    // If no conversation exists, create one
    if (!conversation) {
      conversation = this.conversationRepository.create({
        listing,
        buyer,
        seller,
        status: ConversationStatus.ACTIVE,
      });
      await this.conversationRepository.save(conversation);
    }

    return this.getConversationById(conversation.id);
  }

  async getMessagesForConversation(
    conversationId: string,
    page: number = 1, 
    limit: number = 20
  ): Promise<{ messages: MessageDto[], total: number }> {
    const [messages, total] = await this.messageRepository
      .createQueryBuilder('msg')
      .leftJoinAndSelect('msg.sender', 'sender')
      .leftJoinAndSelect('msg.conversation', 'conversation')
      .where('conversation.id = :conversationId', { conversationId })
      .andWhere('msg.is_deleted = false')
      .orderBy('msg.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const messagesDto = messages.map(message => ({
      id: message.id,
      conversation_id: message.conversation.id,
      sender_id: message.sender.id,
      message_type: message.message_type,
      content: message.content,
      is_read: message.is_read,
      is_deleted: message.is_deleted,
      created_at: message.created_at,
      sender: message.sender ? {
        id: message.sender.id,
        username: message.sender.username,
        profile_picture_url: message.sender.profile_picture_url,
      } : undefined,
    }));

    return { 
      messages: messagesDto.reverse(), // Return in chronological order
      total 
    };
  }

  async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDto> {
    const { conversation_id, sender_id, message_type, content } = createMessageDto;

    // Verify conversation exists
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversation_id },
      relations: ['buyer', 'seller'],
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${conversation_id} not found`);
    }

    // Verify sender exists
    const sender = await this.userRepository.findOne({
      where: { id: sender_id },
    });

    if (!sender) {
      throw new NotFoundException(`User with id ${sender_id} not found`);
    }

    // Verify sender is part of the conversation
    if (sender_id !== conversation.buyer.id && sender_id !== conversation.seller.id) {
      throw new BadRequestException('User is not part of this conversation');
    }

    // Create new message
    const message = this.messageRepository.create({
      conversation,
      sender,
      message_type: message_type || MessageType.TEXT,
      content,
    });

    if (!conversation.first_message_at) {
      conversation.first_message_at = new Date();
    }

    conversation.last_message_at = new Date();

    // Update unread count
    if (sender_id === conversation.buyer.id) {
      conversation.unread_count_seller += 1;
    } else {
      conversation.unread_count_buyer += 1;
    }

    // Save message and update conversation
    await this.messageRepository.save(message);
    await this.conversationRepository.save(conversation);

    // Fetch the saved message with the sender info
    const savedMessage = await this.messageRepository.findOne({
      where: { id: message.id },
      relations: ['sender', 'conversation'],
    });
    
    if(!savedMessage){
        throw new NotFoundException("Saved message not found");
    }

    return {
      id: savedMessage.id,
      conversation_id: savedMessage.conversation.id,
      sender_id: savedMessage.sender.id,
      message_type: savedMessage.message_type,
      content: savedMessage.content,
      is_read: savedMessage.is_read,
      is_deleted: savedMessage.is_deleted,
      created_at: savedMessage.created_at,
      sender: savedMessage.sender ? {
        id: savedMessage.sender.id,
        username: savedMessage.sender.username,
        profile_picture_url: savedMessage.sender.profile_picture_url,
      } : undefined,
    };
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    // Verify conversation exists
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['buyer', 'seller'],
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${conversationId} not found`);
    }

    // Mark messages as read and reset unread count
    if (userId === conversation.buyer.id) {
      // Buyer is reading, so mark seller's messages as read
      await this.messageRepository.update(
        {
          conversation: { id: conversationId },
          sender: { id: conversation.seller.id },
          is_read: false,
        },
        { is_read: true },
      );
      
      // Reset buyer's unread count
      conversation.unread_count_buyer = 0;
    } else if (userId === conversation.seller.id) {
      // Seller is reading, so mark buyer's messages as read
      await this.messageRepository.update(
        {
          conversation: { id: conversationId },
          sender: { id: conversation.buyer.id },
          is_read: false,
        },
        { is_read: true },
      );
      
      // Reset seller's unread count
      conversation.unread_count_seller = 0;
    } else {
      throw new BadRequestException('User is not part of this conversation');
    }

    // Update conversation
    await this.conversationRepository.save(conversation);
  }

  async archiveConversation(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['buyer', 'seller'],
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${conversationId} not found`);
    }

    // Check if user is part of the conversation
    if (userId !== conversation.buyer.id && userId !== conversation.seller.id) {
      throw new BadRequestException('User is not part of this conversation');
    }

    conversation.status = ConversationStatus.ARCHIVED;
    await this.conversationRepository.save(conversation);
  }
}