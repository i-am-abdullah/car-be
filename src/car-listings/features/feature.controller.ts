import { Controller, Get, Post, Body, Param, Query, Put, Delete, ParseUUIDPipe, ParseBoolPipe } from '@nestjs/common';
import { FeaturesService } from './feature.service';
import { Features } from './feature.entity';
import { CreateFeatureDto } from './feature.dto';

@Controller('features')
export class FeaturesController {
  constructor(private readonly FeaturesService: FeaturesService) {}

  @Post()
  async addFeature(@Body() createFeatureDto: CreateFeatureDto): Promise<Features> {
    return this.FeaturesService.addFeature(createFeatureDto);
  }

  @Post('bulk')
  async addMultipleFeatures(@Body() createFeatureDtos: CreateFeatureDto[]): Promise<Features[]> {
    return this.FeaturesService.addMultipleFeatures(createFeatureDtos);
  }

  @Get()
  async getAllFeatures(
    @Query('activeOnly', new ParseBoolPipe({ optional: true })) activeOnly?: boolean,
  ): Promise<Features[]> {
    return this.FeaturesService.getAllFeatures(activeOnly);
  }

  @Get(':id')
  async getFeatureById(@Param('id', ParseUUIDPipe) id: string): Promise<Features> {
    return this.FeaturesService.getFeatureById(id);
  }

  @Put(':id')
  async updateFeature(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<CreateFeatureDto>,
  ): Promise<Features> {
    return this.FeaturesService.updateFeature(id, updateData);
  }

  @Delete(':id')
  async deleteFeature(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.FeaturesService.deleteFeature(id);
  }
}