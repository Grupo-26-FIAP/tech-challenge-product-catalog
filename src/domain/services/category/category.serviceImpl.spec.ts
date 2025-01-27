import { Test, TestingModule } from '@nestjs/testing';
import { CategoryEntity } from '../../entities/category.entity';
import {
  ICategoryRepository,
  ICategoryRepositorySymbol,
} from '../../repositories/category.repository';
import { CategoryServiceImpl } from './category.serviceImpl';

describe('CategoryServiceImpl', () => {
  let service: CategoryServiceImpl;
  let repository: ICategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryServiceImpl,
        {
          provide: ICategoryRepositorySymbol,
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryServiceImpl>(CategoryServiceImpl);
    repository = module.get<ICategoryRepository>(ICategoryRepositorySymbol);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      const category = new CategoryEntity('Test Product');
      jest.spyOn(repository, 'save').mockResolvedValueOnce(undefined);

      await expect(service.createCategory(category)).resolves.toBeUndefined();
      expect(repository.save).toHaveBeenCalledWith(category);
    });

    it('should throw an error if creation fails', async () => {
      const category = new CategoryEntity('Test Product');
      jest
        .spyOn(repository, 'save')
        .mockRejectedValueOnce(new Error('Creation failed'));

      await expect(service.createCategory(category)).rejects.toThrow(
        'Creation failed',
      );
    });
  });

  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
      const category = new CategoryEntity('Test Product');
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      await expect(
        service.updateCategory(1, category),
      ).resolves.toBeUndefined();
      expect(repository.update).toHaveBeenCalledWith(1, category);
    });

    it('should throw an error if update fails', async () => {
      const category = new CategoryEntity('Test Product');
      jest
        .spyOn(repository, 'update')
        .mockRejectedValueOnce(new Error('Update failed'));

      await expect(service.updateCategory(1, category)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category successfully', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      await expect(service.deleteCategory(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if deletion fails', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValueOnce(new Error('Deletion failed'));

      await expect(service.deleteCategory(1)).rejects.toThrow(
        'Deletion failed',
      );
    });
  });

  describe('findCategories', () => {
    it('should find categories successfully', async () => {
      const categories = [new CategoryEntity('Test Product')];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(categories);

      await expect(service.findCategories()).resolves.toEqual(categories);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should throw an error if finding categories fails', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValueOnce(new Error('Find failed'));

      await expect(service.findCategories()).rejects.toThrow('Find failed');
    });
  });
});
