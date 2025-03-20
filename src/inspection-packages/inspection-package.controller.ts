import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { InspectionPackageService } from './inspection-package.service';
import { InspectionPackage } from './entity/inspection-packages.entity';
import { CreateInspectionPackageDto, UpdateInspectionPackageDto } from './dto/inspection-package.dto';

@Controller('inspection-packages')
export class InspectionPackageController {
  constructor(private readonly inspectionPackageService: InspectionPackageService) {}

  @Get()
  findAll(): Promise<InspectionPackage[]> {
    return this.inspectionPackageService.findAll();
  }

  @Get('active')
  findAllActive(): Promise<InspectionPackage[]> {
    return this.inspectionPackageService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<InspectionPackage> {
    return this.inspectionPackageService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateInspectionPackageDto): Promise<InspectionPackage> {
    return this.inspectionPackageService.create(createDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateInspectionPackageDto,
  ): Promise<InspectionPackage> {
    return this.inspectionPackageService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.inspectionPackageService.remove(id);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseUUIDPipe) id: string): Promise<InspectionPackage> {
    return this.inspectionPackageService.toggleActive(id);
  }
}