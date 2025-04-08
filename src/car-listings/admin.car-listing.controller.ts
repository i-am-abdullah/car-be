import {
    Controller,
    Get,
    Patch,
    Post,
    Param,
    Delete,
    Query,
    Body,
    UseGuards,
    HttpStatus,
    HttpCode,
    ParseUUIDPipe,
    ValidationPipe,
  } from '@nestjs/common';
  import { CarListingService } from './car-listing.service';
  import { SearchCarListingDto } from './car-listing.dto';
  import { AuthGuard } from 'src/auth/guards/auth.guard';
  
  @Controller('admin/car-listings')
  @UseGuards(AuthGuard)
  export class AdminCarListingController {
    constructor(private readonly carListingService: CarListingService) {}
  
    @Get()
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.carListingService.findAll(page, limit);
    }
  
    @Get('status/:status')
    async findByStatus(
      @Param('status') status: 'draft' | 'pending' | 'active' | 'sold' | 'inactive' | 'rejected',
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.carListingService.findByStatus(status, page, limit);
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.carListingService.findOne(id);
    }
  
    @Patch(':id/status')
    async updateStatus(
      @Param('id', ParseUUIDPipe) id: string,
      @Body('status')
      status: 'draft' | 'pending' | 'active' | 'sold' | 'inactive' | 'rejected',
    ) {
      return this.carListingService.updateStatus(id, status);
    }
  
    @Patch(':id/feature')
    async markAsFeatured(
      @Param('id', ParseUUIDPipe) id: string,
      @Body('featuredUntil') featuredUntil: Date,
    ) {
      return this.carListingService.markAsFeatured(id, featuredUntil);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      await this.carListingService.remove(id);
    }
  
    @Post('search')
    async search(
      @Body(ValidationPipe) searchParams: SearchCarListingDto,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.carListingService.search(searchParams, page, limit);
    }
  }