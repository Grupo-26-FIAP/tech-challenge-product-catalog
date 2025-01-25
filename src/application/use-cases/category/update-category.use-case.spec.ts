import {
  ICategoryService,
  ICategoryServiceSymbol,
} from '@Domain/services/category/category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCategoryRequestDto } from '../../dtos/request/category/category.request.dto';
import { CategoryMapper } from '../../mappers/category.mapper';
import { UpdateCategoryUseCase } from './update-category.use-case';

describe('UpdateCategoryUseCase', () => {
  let updateCategoryUseCase: UpdateCategoryUseCase;
  let categoryService: ICategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCategoryUseCase,
        {
          provide: ICategoryServiceSymbol,
          useValue: {
            updateCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    updateCategoryUseCase = module.get<UpdateCategoryUseCase>(
      UpdateCategoryUseCase,
    );
    categoryService = module.get<ICategoryService>(ICategoryServiceSymbol);
  });

  it('should be defined', () => {
    expect(updateCategoryUseCase).toBeDefined();
  });

  it('should update a category successfully', async () => {
    const dto: UpdateCategoryRequestDto = { name: 'Updated Category' };
    const entity = CategoryMapper.toEntityUpdate(dto);

    jest.spyOn(CategoryMapper, 'toEntityUpdate').mockReturnValue(entity);
    jest.spyOn(categoryService, 'updateCategory').mockResolvedValue(undefined);

    await updateCategoryUseCase.execute(1, dto);

    expect(CategoryMapper.toEntityUpdate).toHaveBeenCalledWith(dto);
    expect(categoryService.updateCategory).toHaveBeenCalledWith(1, entity);
  });

  it('should handle errors when updating a category', async () => {
    const dto: UpdateCategoryRequestDto = { name: 'Updated Category' };
    const entity = { id: 1, name: 'Updated Category' };
    const error = new Error('Error updating category');

    jest.spyOn(CategoryMapper, 'toEntityUpdate').mockReturnValue(entity);
    jest.spyOn(categoryService, 'updateCategory').mockRejectedValue(error);

    await expect(updateCategoryUseCase.execute(1, dto)).rejects.toThrow(error);

    expect(CategoryMapper.toEntityUpdate).toHaveBeenCalledWith(dto);
    expect(categoryService.updateCategory).toHaveBeenCalledWith(1, entity);
  });
});
