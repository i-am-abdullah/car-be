import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { PrimaryDetailsService } from './primary-details.service';
import { CarMake } from './entities/car-make.entity';
import { CarModel } from './entities/car-model.entity';
import { CarYear } from './entities/car-year.entity';
import { CarVariant } from './entities/car-variant.entity';

class CreateCarMakeDto {
  name: string;
  image_url?: string;
}

class CreateCarModelDto {
  name: string;
  image_url?: string;
  makeId: string;
}

class CreateCarYearDto {
  year: number;
  makeId: string;
  modelId: string;
}

class CreateCarVariantDto {
  name: string;
  description?: string;
  makeId: string;
  modelId: string;
  yearId: string;
}

@Controller('car/primary-details')
export class PrimaryDetailsController {
  constructor(private readonly primaryDetailsService: PrimaryDetailsService) {}

  @Get('make')
  async getAllCarMakes(): Promise<CarMake[]> {
    return this.primaryDetailsService.getAllCarMakes();
  }

  @Get('make/:id')
  async getCarMakeById(@Param('id', ParseUUIDPipe) id: string): Promise<CarMake> {
    return this.primaryDetailsService.getCarMakeById(id);
  }

  @Post('make')
  async createCarMake(@Body() createCarMakeDto: CreateCarMakeDto): Promise<CarMake> {
    return this.primaryDetailsService.createCarMake(createCarMakeDto);
  }

  @Get('model')
  async getAllCarModels(): Promise<CarModel[]> {
    return this.primaryDetailsService.getAllCarModels();
  }

  @Get('make/:makeId/model')
  async getCarModelsByMakeId(
    @Param('makeId', ParseUUIDPipe) makeId: string
  ): Promise<CarModel[]> {
    return this.primaryDetailsService.getCarModelsByMakeId(makeId);
  }

  @Get('model/:id')
  async getCarModelById(@Param('id', ParseUUIDPipe) id: string): Promise<CarModel> {
    return this.primaryDetailsService.getCarModelById(id);
  }

  @Post('model')
  async createCarModel(@Body() createCarModelDto: CreateCarModelDto): Promise<CarModel> {
    return this.primaryDetailsService.createCarModel(createCarModelDto);
  }

  @Get('year')
  async getAllCarYears(): Promise<CarYear[]> {
    return this.primaryDetailsService.getAllCarYears();
  }

  @Get('make/:makeId/model/:modelId/year')
  async getCarYearsByMakeAndModelIds(
    @Param('makeId', ParseUUIDPipe) makeId: string,
    @Param('modelId', ParseUUIDPipe) modelId: string
  ): Promise<CarYear[]> {
    return this.primaryDetailsService.getCarYearsByMakeAndModelIds(makeId, modelId);
  }

  @Get('year/:id')
  async getCarYearById(@Param('id', ParseUUIDPipe) id: string): Promise<CarYear> {
    return this.primaryDetailsService.getCarYearById(id);
  }

  @Post('year')
  async createCarYear(@Body() createCarYearDto: CreateCarYearDto): Promise<CarYear> {
    return this.primaryDetailsService.createCarYear(createCarYearDto);
  }

  @Get('variant')
  async getAllCarVariants(): Promise<CarVariant[]> {
    return this.primaryDetailsService.getAllCarVariants();
  }

  @Get('make/:makeId/models/:modelId/years/:yearId/variant')
  async getCarVariantsByMakeModelAndYearIds(
    @Param('makeId', ParseUUIDPipe) makeId: string,
    @Param('modelId', ParseUUIDPipe) modelId: string,
    @Param('yearId', ParseUUIDPipe) yearId: string
  ): Promise<CarVariant[]> {
    return this.primaryDetailsService.getCarVariantsByMakeModelAndYearIds(makeId, modelId, yearId);
  }

  @Get('variant/:id')
  async getCarVariantById(@Param('id', ParseUUIDPipe) id: string): Promise<CarVariant> {
    return this.primaryDetailsService.getCarVariantById(id);
  }

  @Post('variant')
  async createCarVariant(@Body() createCarVariantDto: CreateCarVariantDto): Promise<CarVariant> {
    return this.primaryDetailsService.createCarVariant(createCarVariantDto);
  }
}