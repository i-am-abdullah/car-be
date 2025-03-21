import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InspectionRequestService } from './inspection-request.service';
import { CreateInspectionRequestDto } from './dto/inspection-request.dto';
import { UpdateInspectionRequestDto } from './dto/inspection-request.dto';
import { InspectionRequest } from './entity/inspection-request.entity';

@Controller('inspection-requests')
export class InspectionRequestController {
  constructor(private readonly inspectionRequestService: InspectionRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInspectionRequestDto: CreateInspectionRequestDto): Promise<InspectionRequest> {
    return this.inspectionRequestService.create(createInspectionRequestDto);
  }

  @Get()
  findAll(): Promise<InspectionRequest[]> {
    return this.inspectionRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<InspectionRequest> {
    return this.inspectionRequestService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateInspectionRequestDto: UpdateInspectionRequestDto
  ): Promise<InspectionRequest> {
    return this.inspectionRequestService.update(id, updateInspectionRequestDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.inspectionRequestService.remove(id);
  }
}