import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ProductModule,
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://localhost:27017/testProject',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
