import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FileModule } from 'src/file/file.module';
import { DishController } from './dish.controller';
import { dishProviders } from './dish.providers';
import { DishService } from './dish.service';

@Module({
  imports: [DatabaseModule, FileModule],
  controllers: [DishController],
  providers: [DishService, ...dishProviders],
})
export class DishModule {}
