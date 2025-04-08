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
    Req,
    HttpStatus,
    HttpCode,
    ParseUUIDPipe,
    ValidationPipe,
    ForbiddenException
  } from '@nestjs/common';
  import { CarListingService } from './car-listing.service';
  import { CreateCarListingDto, UpdateCarListingDto } from './car-listing.dto';
  import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
  import { AuthGuard } from 'src/auth/guards/auth.guard';
  
  @Controller('user/car-listings')
  @UseGuards(AuthGuard)
  export class UserCarListingController {
    constructor(private readonly carListingService: CarListingService) {}
  
    @Post()
    @UseGuards(AuthGuard)
    async create(
      @Body(ValidationPipe) createCarListingDto: CreateCarListingDto,
      @Req() req:RequestWithUser,
    ) {
      return this.carListingService.create(createCarListingDto, req.user.id);
    }
  
    @Get()
    async findByUserId(
      @Req() req: RequestWithUser,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.carListingService.findByUserId(req.user.id, page, limit);
    }
  
    @Get(':id')
    async findOne(
      @Param('id', ParseUUIDPipe) id: string,
      @Req() req: RequestWithUser,
    ) {
      const listing = await this.carListingService.findOne(id);
      
      // Ensure the user can only access their own listings
      if (listing.user.id !== req.user.id) {
        throw new ForbiddenException('You are not authorized to view this listing');
      }
  
      return listing;
    }
  
    @Patch(':id')
    @UseGuards(AuthGuard)
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body(ValidationPipe) updateCarListingDto: UpdateCarListingDto,
      @Req() req:RequestWithUser
    ) {
      return this.carListingService.update(id, updateCarListingDto, req.user.id);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
      @Param('id', ParseUUIDPipe) id: string,
      @Req() req: RequestWithUser,
    ) {
      const listing = await this.carListingService.findOne(id);
      
      // Ensure the user can only delete their own listings
      if (listing.user.id !== req.user.id) {
        throw new ForbiddenException('You are not authorized to delete this listing');
      }
  
      await this.carListingService.remove(id);
    }
  }