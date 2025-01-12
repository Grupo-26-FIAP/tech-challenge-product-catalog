import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategorySeeder } from './category.seeder';
import { ProductSeeder } from './product.seeder';

@Injectable()
export class SeederProvider implements OnModuleInit {
  constructor(
    private readonly categorySeeder: CategorySeeder,
    private readonly productSeeder: ProductSeeder,
  ) {}

  async onModuleInit() {
    await this.categorySeeder.seed();
    await this.productSeeder.seed();
  }
}
