import { CategoryEntity } from '@Domain/entities/category.entity';
import { CategoryRepositoryImpl } from '@Infrastructure/repositories/category.repository.impl';
import { CategoryMapper } from '@Infrastructure/typeorm/mappers/category.mapper';
import { CategoryModel } from '@Infrastructure/typeorm/models/category.model';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('CategoryRepositoryImpl', () => {
  let categoryRepository: CategoryRepositoryImpl;
  let repository: Repository<CategoryModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryRepositoryImpl,
        {
          provide: getRepositoryToken(CategoryModel),
          useClass: Repository,
        },
      ],
    }).compile();

    categoryRepository = module.get<CategoryRepositoryImpl>(
      CategoryRepositoryImpl,
    );
    repository = module.get<Repository<CategoryModel>>(
      getRepositoryToken(CategoryModel),
    );
  });

  it('should be defined', () => {
    expect(categoryRepository).toBeDefined();
  });

  it('should find categories', async () => {
    const categoryModels: CategoryModel[] = [
      { id: 1, name: 'Test Category', createdAt: new Date(), products: null },
    ];
    const categoryEntities: CategoryEntity[] = [
      { id: 1, name: 'Test Category' },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(categoryModels);
    jest
      .spyOn(CategoryMapper, 'toEntity')
      .mockImplementation((model) =>
        categoryEntities.find((entity) => entity.id === model.id),
      );

    const result = await categoryRepository.find();

    expect(result).toEqual(categoryEntities);
    expect(repository.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
  });

  it('should save a category', async () => {
    const categoryEntity: CategoryEntity = { id: 1, name: 'Test Category' };
    const categoryModel: CategoryModel = {
      id: 1,
      name: 'Test Category',
      createdAt: new Date(),
      products: null,
    };

    jest.spyOn(CategoryMapper, 'toModel').mockReturnValue(categoryModel);
    jest.spyOn(repository, 'save').mockResolvedValue(categoryModel);
    //test
    await categoryRepository.save(categoryEntity);

    expect(repository.save).toHaveBeenCalledWith(categoryModel);
  });

  it('should update a category', async () => {
    const categoryEntity: CategoryEntity = { id: 1, name: 'Updated Category' };
    const categoryModel: CategoryModel = {
      id: 1,
      name: 'Test Category',
      createdAt: new Date(),
      products: null,
    };

    jest.spyOn(CategoryMapper, 'toModel').mockReturnValue(categoryModel);
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);

    await categoryRepository.update(1, categoryEntity);

    expect(repository.update).toHaveBeenCalledWith(1, { ...categoryModel });
  });

  it('should delete a category', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

    await categoryRepository.delete(1);

    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should handle errors when finding categories', async () => {
    jest
      .spyOn(repository, 'find')
      .mockRejectedValue(new Error('Error finding categories'));

    await expect(categoryRepository.find()).rejects.toThrow(
      'Error finding categories',
    );
  });

  it('should handle errors when saving a category', async () => {
    const categoryEntity: CategoryEntity = { id: 1, name: 'Test Category' };
    jest
      .spyOn(repository, 'save')
      .mockRejectedValue(new Error('Error saving category'));

    await expect(categoryRepository.save(categoryEntity)).rejects.toThrow(
      'Error saving category',
    );
  });

  it('should handle errors when updating a category', async () => {
    const categoryEntity: CategoryEntity = { id: 1, name: 'Updated Category' };
    jest
      .spyOn(repository, 'update')
      .mockRejectedValue(new Error('Error updating category'));

    await expect(categoryRepository.update(1, categoryEntity)).rejects.toThrow(
      'Error updating category',
    );
  });

  it('should handle errors when deleting a category', async () => {
    jest
      .spyOn(repository, 'delete')
      .mockRejectedValue(new Error('Error deleting category'));

    await expect(categoryRepository.delete(1)).rejects.toThrow(
      'Error deleting category',
    );
  });
});
