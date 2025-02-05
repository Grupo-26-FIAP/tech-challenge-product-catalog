import { ProductResponseDto } from '@Application/dtos/response/product/product.response.dto';
import { ProductMapper } from '@Application/mappers/product.mapper';
import { ProductEntity } from '@Domain/entities/product.entity';
import {
  IProductService,
  IProductServiceSymbol,
} from '@Domain/services/product/product.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { FindProductUseCase } from '../src/application/use-cases/product/find-product.use-case';

describe('FindProductUseCase', () => {
  let findProductUseCase: FindProductUseCase;
  let productService: IProductService;
  let cacheService: Cache;

  const mockProductService = {
    findProducts: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindProductUseCase,
        {
          provide: IProductServiceSymbol,
          useValue: mockProductService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    findProductUseCase = module.get<FindProductUseCase>(FindProductUseCase);
    productService = module.get<IProductService>(IProductServiceSymbol);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(findProductUseCase).toBeDefined();
  });

  it('should return cached products if available', async () => {
    const cachedProducts: ProductResponseDto[] = [
      {
        id: 1,
        name: 'Product Name',
        price: 100,
        description: 'Product Description',
        category: 'Category Name',
        preparationTime: 30,
        figureUrl: 'http://example.com/figure.png',
        enabled: true,
      },
    ];

    mockCacheService.get.mockResolvedValue(JSON.stringify(cachedProducts));

    const result = await findProductUseCase.execute('Product Name', 1);

    expect(result).toEqual(cachedProducts);
    expect(cacheService.get).toHaveBeenCalledWith('products');
    expect(productService.findProducts).not.toHaveBeenCalled();
  });

  it('should fetch products from service if not cached', async () => {
    const products: ProductEntity[] = [
      {
        id: 1,
        name: 'Product Name',
        price: 100,
        description: 'Product Description',
        category: { id: 1, name: 'Category Name' },
        preparationTime: 30,
        figureUrl: 'http://example.com/figure.png',
        enabled: true,
      },
    ];

    const productResponseDto = products.map(ProductMapper.toResponseDto);

    mockCacheService.get.mockResolvedValue(null);
    mockProductService.findProducts.mockResolvedValue(products);

    const result = await findProductUseCase.execute('Product Name', 1);

    expect(result).toEqual(productResponseDto);
    expect(cacheService.get).toHaveBeenCalledWith('products');
    expect(productService.findProducts).toHaveBeenCalledWith('Product Name', 1);
    expect(cacheService.set).toHaveBeenCalledWith(
      'products',
      JSON.stringify(productResponseDto),
      5000,
    );
  });

  it('should throw an error if product service fails', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProductService.findProducts.mockRejectedValue(new Error('Find failed'));

    await expect(findProductUseCase.execute('Product Name', 1)).rejects.toThrow(
      'Find failed',
    );
    expect(cacheService.get).toHaveBeenCalledWith('products');
    expect(productService.findProducts).toHaveBeenCalledWith('Product Name', 1);
  });
});
