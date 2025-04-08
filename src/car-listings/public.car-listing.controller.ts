import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { CarListingService } from './car-listing.service';
import { SearchCarListingDto } from './car-listing.dto';

@Controller('public/car-listings')
export class PublicCarListingController {
  constructor(private readonly carListingService: CarListingService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.carListingService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.carListingService.findOne(id);
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