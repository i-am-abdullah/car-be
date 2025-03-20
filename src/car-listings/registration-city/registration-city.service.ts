import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { RegistrationCity } from './registration-city.entity';
import { CreateRegistrationCityDto } from './registration-city.dto';
import { UpdateRegistrationCityDto } from './registration-city.dto';

@Injectable()
export class RegistrationCityService {
  constructor(
    @InjectRepository(RegistrationCity)
    private registrationCityRepository: Repository<RegistrationCity>,
  ) {}

  create(createRegistrationCityDto: CreateRegistrationCityDto): Promise<RegistrationCity> {
    const registrationCity = this.registrationCityRepository.create(createRegistrationCityDto);
    return this.registrationCityRepository.save(registrationCity);
  }

  findAll(): Promise<RegistrationCity[]> {
    return this.registrationCityRepository.find();
  }

  findOne(id: string): Promise<any> {
    return this.registrationCityRepository.findOne({ where: { id } });
  }

  async update(id: string, updateRegistrationCityDto: UpdateRegistrationCityDto): Promise<any> {
    await this.registrationCityRepository.update(id, updateRegistrationCityDto);
    return this.registrationCityRepository.findOne({ where: { id } });
  }

  remove(id: string): Promise<DeleteResult> {
    return this.registrationCityRepository.delete(id);
  }
}