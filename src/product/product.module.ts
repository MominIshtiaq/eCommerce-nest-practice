import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoryModule } from 'src/category/category.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'node:path';
import { ValidateFile } from 'src/middleware/validate-file.pipe';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: path.join(process.cwd(), 'uploads'),
          filename: function (req, file, cb) {
            cb(null, file.originalname + '-' + Date.now());
          },
        }),
      }),
    }),
    TypeOrmModule.forFeature([Product]),
    CategoryModule,
    PaginationModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateFile)
      .forRoutes(
        { path: '/product/:type', method: RequestMethod.POST },
        { path: '/product/upload/:type/:id', method: RequestMethod.POST },
        { path: '/product/:type/:id', method: RequestMethod.PATCH },
      );
  }
}
