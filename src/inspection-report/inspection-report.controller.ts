import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Delete, 
    Put, 
    ParseUUIDPipe,
    UseGuards,
  } from '@nestjs/common';
  import { InspectionReportsService } from './inspection-report.service';
  import { CreateInspectionReportDto } from './dto/inspection-report.dto';
  import { UpdateInspectionReportDto } from './dto/inspection-report.dto';
  import { InspectionReport } from './entity/inspection-report.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
  
  @Controller('inspection-reports')
  export class InspectionReportsController {
    constructor(private readonly inspectionReportsService: InspectionReportsService) {}
  
    @Post()
    @UseGuards(AuthGuard)
    async create(
      @Body() createInspectionReportDto: CreateInspectionReportDto,
  ): Promise<InspectionReport> {
      return await this.inspectionReportsService.create(createInspectionReportDto );
    }
  
    @Get()
    async findAll(): Promise<InspectionReport[]> {
      return await this.inspectionReportsService.findAll();
    }
  
    @Get('request/:requestId')
    async findByRequestId(@Param('requestId', ParseUUIDPipe) requestId: string): Promise<InspectionReport> {
      return await this.inspectionReportsService.findByRequestId(requestId);
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<InspectionReport> {
      return await this.inspectionReportsService.findOne(id);
    }
  
    @Put(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateInspectionReportDto: UpdateInspectionReportDto,
    ): Promise<InspectionReport> {
      return await this.inspectionReportsService.update(id, updateInspectionReportDto);
    }
  
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
      return await this.inspectionReportsService.remove(id);
    }
  }