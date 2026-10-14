import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly repo: Repository<Log>,
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'DESC' }, take: 100 });
  }

  create(data: Partial<Log>) {
    return this.repo.save(this.repo.create(data));
  }
}