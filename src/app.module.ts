import { PostgresConfigService } from '@Infrastructure/typeorm/config/postgres.config.service';
import { CategoryModel } from '@Infrastructure/typeorm/models/category.model';
import { ProductModel } from '@Infrastructure/typeorm/models/product.model';

import { CategorySeeder } from '@Infrastructure/typeorm/seed/category.seeder';
import { ProductSeeder } from '@Infrastructure/typeorm/seed/product.seeder';
import { SeederProvider } from '@Infrastructure/typeorm/seed/seeder.provider';
import { HttpModule } from '@nestjs/axios';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentVariableModule } from '@Shared/config/environment-variable/environment-variable.module';
import { redisStore } from 'cache-manager-redis-yet';
import { CreateCategoryUseCase } from './application/use-cases/category/create-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/category/delete-category.use-case';
import { FindCategoryUseCase } from './application/use-cases/category/find-category.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/category/update-category.use-case';
import { CreateProductUseCase } from './application/use-cases/product/create-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/product/delete-product.use-case';
import { FindProductUseCase } from './application/use-cases/product/find-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/product/update-product.use-case';
import { ICategoryRepositorySymbol } from './domain/repositories/category.repository';
import { IProductRepositorySymbol } from './domain/repositories/product.repository';
import { ICategoryServiceSymbol } from './domain/services/category/category.service';
import { CategoryServiceImpl } from './domain/services/category/category.serviceImpl';
import { IProductServiceSymbol } from './domain/services/product/product.service';
import { ProductServiceImpl } from './domain/services/product/product.serviceImpl';
import { CategoryRepositoryImpl } from './infrastructure/repositories/category.repository.impl';
import { ProductRepositoryImpl } from './infrastructure/repositories/product.repository.impl';
import { CategoryController } from './presentation/controllers/category.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { ProductController } from './presentation/controllers/product.controller';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({}),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    TypeOrmModule.forFeature([ProductModel, CategoryModel]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('CACHE_SERVICE_HOST'),
            port: configService.get<number>('CACHE_SERVICE_PORT'),
          },
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
    }),

    EnvironmentVariableModule.forRoot({ isGlobal: true }),
    TerminusModule,
  ],
  providers: [
    SeederProvider,
    CategorySeeder,
    ProductSeeder,
    ProductServiceImpl,
    FindProductUseCase,
    ProductServiceImpl,
    FindCategoryUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    {
      provide: IProductServiceSymbol,
      useClass: ProductServiceImpl,
    },
    {
      provide: ICategoryServiceSymbol,
      useClass: CategoryServiceImpl,
    },
    {
      provide: IProductRepositorySymbol,
      useClass: ProductRepositoryImpl,
    },
    {
      provide: ICategoryRepositorySymbol,
      useClass: CategoryRepositoryImpl,
    },
  ],
  controllers: [ProductController, CategoryController, HealthController],
})
export class AppModule {}
