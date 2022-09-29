import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as uuid from 'uuid';
import { resolve } from 'path';

export const IMAGES_DIRNAME = 'IMAGES';

@Injectable()
export class FileService {
  async createFile(file: any) {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = resolve(__dirname, '..', 'static', IMAGES_DIRNAME);

      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }
      writeFileSync(resolve(filePath, fileName), file.buffer);

      return IMAGES_DIRNAME + '/' + fileName;
    } catch (e) {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
