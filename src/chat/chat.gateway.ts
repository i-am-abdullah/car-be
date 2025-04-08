import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  import { CreateMessageDto } from './dtos/create-message.dto';
  import { JwtService } from '@nestjs/jwt';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    // Store connected clients with their user IDs
    private connectedClients: Map<string, string> = new Map();
  
    constructor(
      private readonly chatService: ChatService,
      private readonly jwtService: JwtService,
    ) {}
  
    async handleConnection(client: Socket): Promise<void> {
      try {
        // Extract JWT token from handshake
        const token = client.handshake.auth.token || 
                      client.handshake.headers.authorization?.split(' ')[1];
        
        if (!token) {
          client.disconnect();
          return;
        }
  
        // Verify token and get user ID
        const payload = this.jwtService.verify(token);
        const userId = payload.sub;
  
        if (!userId) {
          client.disconnect();
          return;
        }
  
        // Store client connection with user ID
        this.connectedClients.set(client.id, userId);
        
        // Join user to their own room (for private messages)
        client.join(userId);
        
        console.log(`Client connected: ${client.id}, User: ${userId}`);
      } catch (error) {
        console.error('Connection error:', error.message);
        client.disconnect();
      }
    }
  
    handleDisconnect(client: Socket): void {
      // Remove client from connected clients
      this.connectedClients.delete(client.id);
      console.log(`Client disconnected: ${client.id}`);
    }
  
    // Join a specific conversation room
    @SubscribeMessage('joinConversation')
    async handleJoinConversation(
      @ConnectedSocket() client: Socket,
      @MessageBody() conversationId: string,
    ): Promise<void> {
      try {
        const userId = this.connectedClients.get(client.id);
        if (!userId) {
          return;
        }
  
        // Get conversation to verify user is part of it
        const conversation = await this.chatService.getConversationById(conversationId);
        
        if (userId !== conversation.buyer_id && userId !== conversation.seller_id) {
          return;
        }
  
        // Join conversation room
        client.join(conversationId);
        console.log(`User ${userId} joined conversation ${conversationId}`);
        
        // Mark messages as read when joining a conversation
        await this.chatService.markMessagesAsRead(conversationId, userId);
        
        // Emit event to update read status
        this.server.to(conversationId).emit('messagesRead', {
          conversationId,
          userId,
        });
      } catch (error) {
        console.error('Join conversation error:', error.message);
      }
    }
  
    // Leave a specific conversation room
    @SubscribeMessage('leaveConversation')
    handleLeaveConversation(
      @ConnectedSocket() client: Socket,
      @MessageBody() conversationId: string,
    ): void {
      client.leave(conversationId);
      const userId = this.connectedClients.get(client.id);
      console.log(`User ${userId} left conversation ${conversationId}`);
    }
  
    // Send a message
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody() createMessageDto: CreateMessageDto,
    ): Promise<void> {
      try {
        const userId = this.connectedClients.get(client.id);
        
        if (!userId || userId !== createMessageDto.sender_id) {
          return;
        }
  
        // Create the message
        const message = await this.chatService.createMessage(createMessageDto);
        
        // Broadcast message to the conversation room
        this.server.to(createMessageDto.conversation_id).emit('newMessage', message);
        
        // Get conversation to notify the other user if they're not in the room
        const conversation = await this.chatService.getConversationById(createMessageDto.conversation_id);
        
        // Determine recipient user ID
        const recipientId = userId === conversation.buyer_id 
          ? conversation.seller_id 
          : conversation.buyer_id;
  
        // Send notification to recipient's room if they're online
        this.server.to(recipientId).emit('messageNotification', {
          conversationId: conversation.id,
          message: message.content,
          sender: message.sender,
        });
      } catch (error) {
        console.error('Send message error:', error.message);
        
        // Emit error back to sender
        client.emit('messageError', {
          error: error.message,
          originalMessage: createMessageDto,
        });
      }
    }
  
    @SubscribeMessage('markAsRead')
    async handleMarkAsRead(
      @ConnectedSocket() client: Socket,
      @MessageBody() { conversationId }: { conversationId: string },
    ): Promise<void> {
      try {
        const userId = this.connectedClients.get(client.id);
        
        if (!userId) {
          return;
        }
  
        await this.chatService.markMessagesAsRead(conversationId, userId);
        
        // Broadcast to the conversation that messages have been read
        this.server.to(conversationId).emit('messagesRead', {
          conversationId,
          userId,
        });
      } catch (error) {
        console.error('Mark as read error:', error.message);
      }
    }
  

    @SubscribeMessage('typing')
    handleTyping(
      @ConnectedSocket() client: Socket,
      @MessageBody() { conversationId, isTyping }: { conversationId: string; isTyping: boolean },
    ): void {
      const userId = this.connectedClients.get(client.id);
      
      if (!userId) {
        return;
      }
  
      // Broadcast typing status to others in the conversation
      client.to(conversationId).emit('userTyping', {
        conversationId,
        userId,
        isTyping,
      });
    }
  }