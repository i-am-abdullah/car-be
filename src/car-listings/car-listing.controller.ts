// src/car-listing/car-listing.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Request,
    Req,
    HttpStatus,
    HttpCode,
    ParseUUIDPipe,
    ValidationPipe,
  } from '@nestjs/common';
  import { CarListingService } from './car-listing.service';
  import { CreateCarListingDto, UpdateCarListingDto, SearchCarListingDto } from './car-listing.dto';
  import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
  import { AuthGuard } from 'src/auth/guards/auth.guard';
  
  @Controller('car-listing')
  export class CarListingController {
    constructor(private readonly carListingService: CarListingService) {}
  
    // Create a new car listing
    @Post()
    @UseGuards(AuthGuard)
    async create(
      @Body(ValidationPipe) createCarListingDto: CreateCarListingDto,
      @Req() req:RequestWithUser,
    ) {
      if (!createCarListingDto.user_id) {
        createCarListingDto.user_id = req.user.id;
      }
      return this.carListingService.create(createCarListingDto);
    }
  
    // Get all car listings with pagination (default page 1, limit 10)
    @Get()
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.carListingService.findAll(page, limit);
    }
  
    // Get a specific car listing by ID
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.carListingService.findOne(id);
    }
  
    // Update a car listing
    
    @Patch(':id')
    @UseGuards(AuthGuard)
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body(ValidationPipe) updateCarListingDto: UpdateCarListingDto,
      @Req() req:RequestWithUser
    ) {
      if (!updateCarListingDto.user_id) {
        updateCarListingDto.user_id = req?.user?.id;
      }
      return this.carListingService.update(id, updateCarListingDto);
    }
  
    // Delete a car listing (returns no content)
    @Delete(':id')
    // @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      await this.carListingService.remove(id);
    }
  
    // Update the status of a car listing
    @Patch(':id/status')
    // @UseGuards(AuthGuard)
    async updateStatus(
      @Param('id', ParseUUIDPipe) id: string,
      @Body('status')
      status: 'draft' | 'pending' | 'active' | 'sold' | 'inactive' | 'rejected',
    ) {
      return this.carListingService.updateStatus(id, status);
    }
  
    // Get car listings by user ID with pagination
    @Get('user/:userId')
    async findByUserId(
      @Param('userId', ParseUUIDPipe) userId: string,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.carListingService.findByUserId(userId, page, limit);
    }
  
    // Get car listings by status with pagination
    @Get('status/:status')
    async findByStatus(
      @Param('status') status: 'draft' | 'pending' | 'active' | 'sold' | 'inactive' | 'rejected',
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.carListingService.findByStatus(status, page, limit);
    }
  
    // Mark a car listing as featured
    @Patch(':id/feature')
    // @UseGuards(AuthGuard)
    async markAsFeatured(
      @Param('id', ParseUUIDPipe) id: string,
      @Body('featuredUntil') featuredUntil: Date,
    ) {
      return this.carListingService.markAsFeatured(id, featuredUntil);
    }
  
    // Search car listings by various criteria with pagination
    @Post('search')
    async search(
      @Body(ValidationPipe) searchParams: SearchCarListingDto,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.carListingService.search(searchParams, page, limit);
    }
  }
  