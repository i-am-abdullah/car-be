import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { RegistrationCityService } from './registration-city.service';
import { CreateRegistrationCityDto } from './registration-city.dto';
import { UpdateRegistrationCityDto } from './registration-city.dto';

@Controller('registration-cities')
export class RegistrationCityController {
  constructor(private readonly registrationCityService: RegistrationCityService) {}

  @Post()
  async create(@Body() createRegistrationCityDto: CreateRegistrationCityDto) {
    try {
      return await this.registrationCityService.create(createRegistrationCityDto);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation code
        throw new HttpException('City with this name already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException('Failed to create registration city', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll() {
    return this.registrationCityService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const city = await this.registrationCityService.findOne(id);
    if (!city) {
      throw new HttpException('Registration city not found', HttpStatus.NOT_FOUND);
    }
    return city;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRegistrationCityDto: UpdateRegistrationCityDto) {
    try {
      const city = await this.registrationCityService.update(id, updateRegistrationCityDto);
      if (!city) {
        throw new HttpException('Registration city not found', HttpStatus.NOT_FOUND);
      }
      return city;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException('City with this name already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException('Failed to update registration city', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.registrationCityService.remove(id);
    if (!result.affected) {
      throw new HttpException('Registration city not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Registration city deleted successfully' };
  }
}