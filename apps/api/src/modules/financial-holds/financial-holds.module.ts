import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity';
import { FinancialHold } from './entities/financial-hold.entity';
import { FinancialHoldsController } from './financial-holds.controller';
import { FinancialHoldsService } from './financial-holds.service';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialHold, Student])],
  controllers: [FinancialHoldsController],
  providers: [FinancialHoldsService],
  exports: [FinancialHoldsService],
})
export class FinancialHoldsModule {}
