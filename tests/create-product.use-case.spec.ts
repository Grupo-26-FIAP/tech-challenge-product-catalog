import { ProductEntity } from '@Domain/entities/product.entity';
import {
  IProductService,
  IProductServiceSymbol,
} from '@Domain/services/product/product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductRequestDto } from '../src/application/dtos/request/product/product.request.dto';
import { ProductResponseDto } from '../src/application/dtos/response/product/product.response.dto';
import { ProductMapper } from '../src/application/mappers/product.mapper';
import { CreateProductUseCase } from '../src/application/use-cases/product/create-product.use-case';

describe('CreateProductUseCase', () => {
  let createProductUseCase: CreateProductUseCase;
  let productService: IProductService;

  const mockProductService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: IProductServiceSymbol,
          useValue: mockProductService,
        },
      ],
    }).compile();

    createProductUseCase =
      module.get<CreateProductUseCase>(CreateProductUseCase);
    productService = module.get<IProductService>(IProductServiceSymbol);
  });

  it('should be defined', () => {
    expect(createProductUseCase).toBeDefined();
  });

  it('should create a product successfully', async () => {
    const dto: ProductRequestDto = {
      name: 'New Product',
      price: 100,
      description: 'New Product Description',
      categoryId: 1,
      preparationTime: 30,
      figureUrl: 'http://example.com/figure.png',
      enabled: true,
    };

    const product: ProductEntity = {
      id: 1,
      name: dto.name,
      price: dto.price,
      description: dto.description,
      category: { id: 1, name: 'Category Name' },
      preparationTime: dto.preparationTime,
      figureUrl: dto.figureUrl,
      enabled: dto.enabled ?? true,
    };

    const productResponseDto: ProductResponseDto = {
      id: 1,
      name: dto.name,
      price: dto.price,
      description: dto.description,
      category: 'Category Name',
      preparationTime: dto.preparationTime,
      figureUrl: dto.figureUrl,
      enabled: dto.enabled ?? true,
    };

    mockProductService.create.mockResolvedValue(product);

    await expect(createProductUseCase.execute(dto)).resolves.toEqual(
      productResponseDto,
    );
    expect(productService.create).toHaveBeenCalledWith(
      ProductMapper.toEntity(dto),
    );
  });

  it('should throw an error if creation fails', async () => {
    const dto: ProductRequestDto = {
      name: 'New Product',
      price: 100,
      description: 'New Product Description',
      categoryId: 1,
      preparationTime: 30,
      figureUrl: 'http://example.com/figure.png',
      enabled: true,
    };

    mockProductService.create.mockRejectedValue(new Error('Creation failed'));

    await expect(createProductUseCase.execute(dto)).rejects.toThrow(
      'Creation failed',
    );
    expect(productService.create).toHaveBeenCalledWith(
      ProductMapper.toEntity(dto),
    );
  });

  it('should throw an error if DTO is invalid', async () => {
    const dto: ProductRequestDto = {
      name: '',
      price: -100,
      description: '',
      categoryId: -1,
      preparationTime: -30,
      figureUrl: 'invalid-url',
      enabled: true,
    };

    mockProductService.create.mockRejectedValue(new Error('Invalid DTO'));

    await expect(createProductUseCase.execute(dto)).rejects.toThrow(
      'Invalid DTO',
    );
    expect(productService.create).toHaveBeenCalledWith(
      ProductMapper.toEntity(dto),
    );
  });
});
