import { CategoryEntity } from '@Domain/entities/category.entity';
import {
  ICategoryService,
  ICategoryServiceSymbol,
} from '@Domain/services/category/category.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { FindCategoryUseCase } from './find-category.use-case';

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

    expect(categoryService.findCategories).toHaveBeenCalledWith();
  });
});
