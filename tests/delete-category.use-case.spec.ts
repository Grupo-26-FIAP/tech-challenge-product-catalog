import {
  ICategoryService,
  ICategoryServiceSymbol,
} from '@Domain/services/category/category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteCategoryUseCase } from '../src/application/use-cases/category/delete-category.use-case';

describe('DeleteCategoryUseCase', () => {
  let deleteCategoryUseCase: DeleteCategoryUseCase;
  let categoryService: ICategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCategoryUseCase,
        {
          provide: ICategoryServiceSymbol,
          useValue: {
            deleteCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteCategoryUseCase = module.get<DeleteCategoryUseCase>(
      DeleteCategoryUseCase,
    );
    categoryService = module.get<ICategoryService>(ICategoryServiceSymbol);
  });

  it('should be defined', () => {
    expect(deleteCategoryUseCase).toBeDefined();
  });

  it('should delete a category successfully', async () => {
    jest.spyOn(categoryService, 'deleteCategory').mockResolvedValue(undefined);

    await deleteCategoryUseCase.execute(1);

    expect(categoryService.deleteCategory).toHaveBeenCalledWith(1);
  });

  it('should handle errors when deleting a category', async () => {
    const error = new Error('Error deleting category');
    jest.spyOn(categoryService, 'deleteCategory').mockRejectedValue(error);

    await expect(deleteCategoryUseCase.execute(1)).rejects.toThrow(error);

    expect(categoryService.deleteCategory).toHaveBeenCalledWith(1);
  });
});
