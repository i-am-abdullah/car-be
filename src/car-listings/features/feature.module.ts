import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Features } from './feature.entity';
import { FeaturesService } from './feature.service';
import { FeaturesController } from './feature.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Features]),
  ],
  providers: [FeaturesService],
  controllers: [FeaturesController],
  exports: [FeaturesService],
})
export class FeatureModule {}