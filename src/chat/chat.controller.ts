import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
    Patch,
    ParseUUIDPipe,
    ParseIntPipe,
    DefaultValuePipe,
  } from '@nestjs/common';
  import { ChatService } from './chat.service';
  import { CreateConversationDto } from './dtos/create-conversation.dto';
  import { CreateMessageDto } from './dtos/create-message.dto';
  import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
  
  @Controller('chat')
  @UseGuards(AuthGuard)
  export class ChatController {
    constructor(private readonly chatService: ChatService) {}
  
    @Get('conversations')
    async getUserConversations(@Req() req:RequestWithUser) {
      return this.chatService.findAllConversationsForUser(req.user.id);
    }
  
    @Get('conversations/:id')
    async getConversation(@Param('id', ParseUUIDPipe) id: string) {
      return this.chatService.getConversationById(id);
    }
  
    @Post('conversations')
    async createConversation(
      @Body() createConversationDto: CreateConversationDto,
      @Req() req:RequestWithUser,
    ) {
      createConversationDto.buyer_id = req.user.id;
      return this.chatService.findOrCreateConversation(createConversationDto);
    }
  
    @Get('conversations/:id/messages')
    async getConversationMessages(
      @Param('id', ParseUUIDPipe) id: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
      return this.chatService.getMessagesForConversation(id, page, limit);
    }
  
    @Post('messages')
    async createMessage(@Body() createMessageDto: CreateMessageDto, @Req() req:RequestWithUser) {
      createMessageDto.sender_id = req.user.id;
      return this.chatService.createMessage(createMessageDto);
    }
  
    @Patch('conversations/:id/read')
    async markMessagesAsRead(
      @Param('id', ParseUUIDPipe) id: string,
      @Req() req:RequestWithUser,
    ) {
      await this.chatService.markMessagesAsRead(id, req.user.id);
      return { success: true };
    }
  
    @Patch('conversations/:id/archive')
    async archiveConversation(
      @Param('id', ParseUUIDPipe) id: string,
      @Req() req:RequestWithUser,
    ) {
      await this.chatService.archiveConversation(id, req.user.id);
      return { success: true };
    }
  }