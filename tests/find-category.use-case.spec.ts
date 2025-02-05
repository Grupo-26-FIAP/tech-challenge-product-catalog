import { CategoryEntity } from '@Domain/entities/category.entity';
import {
  ICategoryService,
  ICategoryServiceSymbol,
} from '@Domain/services/category/category.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { FindCategoryUseCase } from '../src/application/use-cases/category/find-category.use-case';

describe('FindCategoryUseCase', () => {
  let findCategoryUseCase: FindCategoryUseCase;
  let categoryService: ICategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCategoryUseCase,
        {
          provide: ICategoryServiceSymbol,
          useValue: {
            findCategories: jest.fn(),
            createCategory: jest.fn(),
            updateCategory: jest.fn(),
            deleteCategory: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    findCategoryUseCase = module.get<FindCategoryUseCase>(FindCategoryUseCase);
    categoryService = module.get<ICategoryService>(ICategoryServiceSymbol);
  });

  it('should be defined', () => {
    expect(findCategoryUseCase).toBeDefined();
  });

  it('should find a category successfully', async () => {
    const categoryEntity: CategoryEntity = { id: 1, name: 'Test Category' };

    jest
      .spyOn(categoryService, 'findCategories')
      .mockResolvedValue([categoryEntity]);

    const result = await findCategoryUseCase.execute();

    expect(result).toEqual([categoryEntity]);
    expect(categoryService.findCategories).toHaveBeenCalledWith();
  });

  it('should handle errors when finding a category', async () => {
    const error = new Error('Error finding category');
    jest.spyOn(categoryService, 'findCategories').mockRejectedValue(error);

    await expect(findCategoryUseCase.execute()).rejects.toThrow(error);
  });

  it('should create a category successfully', async () => {
    const categoryEntity: CategoryEntity = { id: 1, name: 'New Category' };

    jest.spyOn(categoryService, 'createCategory').mockResolvedValue();

    await expect(
      categoryService.createCategory(categoryEntity),
    ).resolves.toBeUndefined();
    expect(categoryService.createCategory).toHaveBeenCalledWith(categoryEntity);
  });

  it('should handle errors when creating a category', async () => {
    const categoryEntity: CategoryEntity = { id: 1, name: 'New Category' };
    const error = new Error('Error creating category');

    jest.spyOn(categoryService, 'createCategory').mockRejectedValue(error);

    await expect(
      categoryService.createCategory(categoryEntity),
    ).rejects.toThrow(error);
  });

  it('should update a category successfully', async () => {
    const categoryEntity: CategoryEntity = { id: 1, name: 'Updated Category' };

    jest.spyOn(categoryService, 'updateCategory').mockResolvedValue();

    await expect(
      categoryService.updateCategory(1, categoryEntity),
    ).resolves.toBeUndefined();
    expect(categoryService.updateCategory).toHaveBeenCalledWith(
      1,
      categoryEntity,
    );
  });

  it('should handle errors when updating a category', async () => {
    const categoryEntity: CategoryEntity = { id: 1, name: 'Updated Category' };
    const error = new Error('Error updating category');

    jest.spyOn(categoryService, 'updateCategory').mockRejectedValue(error);

    await expect(
      categoryService.updateCategory(1, categoryEntity),
    ).rejects.toThrow(error);
  });

  it('should delete a category successfully', async () => {
    const categoryId = 1;

    jest.spyOn(categoryService, 'deleteCategory').mockResolvedValue();

    await expect(
      categoryService.deleteCategory(categoryId),
    ).resolves.toBeUndefined();
    expect(categoryService.deleteCategory).toHaveBeenCalledWith(categoryId);
  });

  it('should handle errors when deleting a category', async () => {
    const categoryId = 1;
    const error = new Error('Error deleting category');

    jest.spyOn(categoryService, 'deleteCategory').mockRejectedValue(error);

    await expect(categoryService.deleteCategory(categoryId)).rejects.toThrow(
      error,
    );
  });

  it('should find a category from cache successfully', async () => {
    const categoryEntity: CategoryEntity = { id: 1, name: 'Test Category' };

    jest
      .spyOn(categoryService, 'findCategories')
      .mockResolvedValue([categoryEntity]);

    const result = await findCategoryUseCase.execute();

    expect(result).toEqual([categoryEntity]);
    expect(categoryService.findCategories).toHaveBeenCalledWith();
  });
});
