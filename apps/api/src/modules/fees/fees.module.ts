import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeStructure } from './entities/fee-structure.entity';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeeStructure])],
  controllers: [FeesController],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}