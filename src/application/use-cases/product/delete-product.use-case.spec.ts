import {
  IProductService,
  IProductServiceSymbol,
} from '@Domain/services/product/product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProductUseCase } from './delete-product.use-case';

describe('DeleteProductUseCase', () => {
  let deleteProductUseCase: DeleteProductUseCase;
  let productService: IProductService;

  const mockProductService = {
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductUseCase,
        {
          provide: IProductServiceSymbol,
          useValue: mockProductService,
        },
      ],
    }).compile();

    deleteProductUseCase =
      module.get<DeleteProductUseCase>(DeleteProductUseCase);
    productService = module.get<IProductService>(IProductServiceSymbol);
  });

  it('should be defined', () => {
    expect(deleteProductUseCase).toBeDefined();
  });

  it('should delete a product successfully', async () => {
    const id = 1;

    mockProductService.delete.mockResolvedValue(undefined);

    await expect(deleteProductUseCase.execute(id)).resolves.toBeUndefined();
    expect(productService.delete).toHaveBeenCalledWith(id);
  });

  it('should throw an error if delete fails', async () => {
    const id = 1;

    mockProductService.delete.mockRejectedValue(new Error('Delete failed'));

    await expect(deleteProductUseCase.execute(id)).rejects.toThrow(
      'Delete failed',
    );
    expect(productService.delete).toHaveBeenCalledWith(id);
  });
});
