import { CreateProductUseCase } from '@Application/use-cases/product/create-product.use-case';
import { DeleteProductUseCase } from '@Application/use-cases/product/delete-product.use-case';
import { FindProductUseCase } from '@Application/use-cases/product/find-product.use-case';
import { UpdateProductUseCase } from '@Application/use-cases/product/update-product.use-case';
import { Given, Then, When } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { strict as assert } from 'assert';
import { ProductController } from 'src/presentation/controllers/product.controller';
import * as request from 'supertest';
import { PRODUCT_REQUEST_DTO_MOCK } from 'tests/__mocks__/product.mock';

let app: INestApplication;
let response: request.Response;

const mockFindProducts = {
  execute: async () => PRODUCT_REQUEST_DTO_MOCK,
};

Given('the system is running', async () => {
  const moduleFixture = await Test.createTestingModule({
    controllers: [ProductController],
    providers: [
      { provide: CreateProductUseCase, useValue: undefined },
      { provide: UpdateProductUseCase, useValue: undefined },
      { provide: DeleteProductUseCase, useValue: undefined },
      { provide: FindProductUseCase, useValue: mockFindProducts },
    ],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

When('I access the route products', async () => {
  response = await request(app.getHttpServer()).get(`/products`);
});

Then('the system should return all products with HTTP code 200', () => {
  assert.strictEqual(response.status, 200);
});
