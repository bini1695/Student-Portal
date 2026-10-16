import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  async saveFile(file: any) {
    return {
      message: 'File uploaded',
      filename: file?.filename || 'unknown',
      originalName: file?.originalname || 'unknown',
      size: file?.size || 0,
      path: `/uploads/${file?.filename || ''}`,
    };
  }

  getFileUrl(filename: string) {
    return {
      url: `/uploads/${filename}`,
    };
  }
}