import {
  ICategoryService,
  ICategoryServiceSymbol,
} from '@Domain/services/category/category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRequestDto } from '../../dtos/request/category/category.request.dto';
import { CategoryMapper } from '../../mappers/category.mapper';
import { CreateCategoryUseCase } from './create-category.use-case';

describe('CreateCategoryUseCase', () => {
  let createCategoryUseCase: CreateCategoryUseCase;
  let categoryService: ICategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCategoryUseCase,
        {
          provide: ICategoryServiceSymbol,
          useValue: {
            createCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    createCategoryUseCase = module.get<CreateCategoryUseCase>(
      CreateCategoryUseCase,
    );
    categoryService = module.get<ICategoryService>(ICategoryServiceSymbol);
  });

  it('should be defined', () => {
    expect(createCategoryUseCase).toBeDefined();
  });

  it('should create a category successfully', async () => {
    const dto: CategoryRequestDto = { name: 'Test Category' };
    const entity = CategoryMapper.toEntity(dto);

    jest.spyOn(CategoryMapper, 'toEntity').mockReturnValue(entity);
    jest.spyOn(categoryService, 'createCategory').mockResolvedValue(undefined);

    await createCategoryUseCase.execute(dto);

    expect(CategoryMapper.toEntity).toHaveBeenCalledWith(dto);
    expect(categoryService.createCategory).toHaveBeenCalledWith(entity);
  });

  it('should handle errors when creating a category', async () => {
    const dto: CategoryRequestDto = { name: 'Test Category' };
    const entity = CategoryMapper.toEntity(dto);
    const error = new Error('Error creating category');

    jest.spyOn(CategoryMapper, 'toEntity').mockReturnValue(entity);
    jest.spyOn(categoryService, 'createCategory').mockRejectedValue(error);

    await expect(createCategoryUseCase.execute(dto)).rejects.toThrow(error);

    expect(CategoryMapper.toEntity).toHaveBeenCalledWith(dto);
    expect(categoryService.createCategory).toHaveBeenCalledWith(entity);
  });
});
