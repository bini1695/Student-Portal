import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: any) {
    return this.uploadsService.saveFile(file);
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string) {
    return this.uploadsService.getFileUrl(filename);
  }
}