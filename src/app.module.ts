import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { DishModule } from './dish/dish.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    DatabaseModule,
    AuthModule,
    OrderModule,
    DishModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
