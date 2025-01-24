import {
  IProductService,
  IProductServiceSymbol,
} from '@Domain/services/product/product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductUpdateRequestDto } from '../../dtos/request/product/product.request.dto';
import { ProductMapper } from '../../mappers/product.mapper';
import { UpdateProductUseCase } from './update-product.use-case';

describe('UpdateProductUseCase', () => {
  let updateProductUseCase: UpdateProductUseCase;
  let productService: IProductService;

  const mockProductService = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductUseCase,
        {
          provide: IProductServiceSymbol,
          useValue: mockProductService,
        },
      ],
    }).compile();

    updateProductUseCase =
      module.get<UpdateProductUseCase>(UpdateProductUseCase);
    productService = module.get<IProductService>(IProductServiceSymbol);
  });

  it('should be defined', () => {
    expect(updateProductUseCase).toBeDefined();
  });

  it('should update a product successfully', async () => {
    const id = 1;
    const dto: ProductUpdateRequestDto = {
      name: 'Updated Product Name',
      price: 150,
      description: 'Updated Product Description',
      categoryId: 2,
      preparationTime: 40,
      figureUrl: 'http://example.com/updated-figure.png',
      enabled: true,
    };

    mockProductService.update.mockResolvedValue(undefined);

    await expect(
      updateProductUseCase.execute(id, dto),
    ).resolves.toBeUndefined();
    expect(productService.update).toHaveBeenCalledWith(
      id,
      ProductMapper.toEntityUpdate(dto),
    );
  });

  it('should throw an error if update fails', async () => {
    const id = 1;
    const dto: ProductUpdateRequestDto = {
      name: 'Updated Product Name',
      price: 150,
      description: 'Updated Product Description',
      categoryId: 2,
      preparationTime: 40,
      figureUrl: 'http://example.com/updated-figure.png',
      enabled: true,
    };

    mockProductService.update.mockRejectedValue(new Error('Update failed'));

    await expect(updateProductUseCase.execute(id, dto)).rejects.toThrow(
      'Update failed',
    );
    expect(productService.update).toHaveBeenCalledWith(
      id,
      ProductMapper.toEntityUpdate(dto),
    );
  });

  it('should throw an error if product ID is invalid', async () => {
    const id = -1;
    const dto: ProductUpdateRequestDto = {
      name: 'Updated Product Name',
      price: 150,
      description: 'Updated Product Description',
      categoryId: 2,
      preparationTime: 40,
      figureUrl: 'http://example.com/updated-figure.png',
      enabled: true,
    };

    mockProductService.update.mockRejectedValue(
      new Error('Invalid product ID'),
    );

    await expect(updateProductUseCase.execute(id, dto)).rejects.toThrow(
      'Invalid product ID',
    );
    expect(productService.update).toHaveBeenCalledWith(
      id,
      ProductMapper.toEntityUpdate(dto),
    );
  });

  it('should throw an error if DTO is invalid', async () => {
    const id = 1;
    const dto: ProductUpdateRequestDto = {
      name: '',
      price: -150,
      description: '',
      categoryId: -2,
      preparationTime: -40,
      figureUrl: 'invalid-url',
      enabled: true,
    };

    mockProductService.update.mockRejectedValue(new Error('Invalid DTO'));

    await expect(updateProductUseCase.execute(id, dto)).rejects.toThrow(
      'Invalid DTO',
    );
    expect(productService.update).toHaveBeenCalledWith(
      id,
      ProductMapper.toEntityUpdate(dto),
    );
  });
});
