import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { InspectionRequestService } from './inspection-request.service';
import { CreateInspectionRequestDto } from './dto/inspection-request.dto';
import { UpdateInspectionRequestDto } from './dto/inspection-request.dto';
import { InspectionRequest } from './entity/inspection-request.entity';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('inspection-requests')
export class InspectionRequestController {
  constructor(private readonly inspectionRequestService: InspectionRequestService) { }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createInspectionRequestDto: CreateInspectionRequestDto,
    @Req() req: RequestWithUser
  ): Promise<InspectionRequest> {
    return this.inspectionRequestService.create(createInspectionRequestDto, req.user.id);
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
    @Body() updateInspectionRequestDto: UpdateInspectionRequestDto,
    @Req() req:RequestWithUser
  ): Promise<InspectionRequest> {
    return this.inspectionRequestService.update(id, updateInspectionRequestDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.inspectionRequestService.remove(id);
  }
}