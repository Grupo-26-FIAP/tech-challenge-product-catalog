import { CategoryEntity } from '@Domain/entities/category.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductEntity } from '../../entities/product.entity';
import {
  IProductRepository,
  IProductRepositorySymbol,
} from '../../repositories/product.repository';
import { ProductServiceImpl } from './product.serviceImpl';

describe('ProductServiceImpl', () => {
  let service: ProductServiceImpl;
  let repository: IProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductServiceImpl,
        {
          provide: IProductRepositorySymbol,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductServiceImpl>(ProductServiceImpl);
    repository = module.get<IProductRepository>(IProductRepositorySymbol);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should find a product by id successfully', async () => {
      const product = new ProductEntity(
        'Test Product',
        'Test Description',
        10,
        10,
        'http://test.com',
        true,
        new CategoryEntity('Test Category'),
      );
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(product);

      await expect(service.findById(1)).resolves.toEqual(product);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if finding by id fails', async () => {
      jest
        .spyOn(repository, 'findById')
        .mockRejectedValueOnce(new Error('Find by id failed'));

      await expect(service.findById(1)).rejects.toThrow('Find by id failed');
    });
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const product = new ProductEntity(
        'Test Product',
        'Test Description',
        10,
        10,
        'http://test.com',
        true,
        new CategoryEntity('Test Category'),
      );
      jest.spyOn(repository, 'save').mockResolvedValueOnce(product);

      await expect(service.create(product)).resolves.toEqual(product);
      expect(repository.save).toHaveBeenCalledWith(product);
    });

    it('should throw an error if creation fails', async () => {
      const product = new ProductEntity(
        'Test Product',
        'Test Description',
        10,
        10,
        'http://test.com',
        true,
        new CategoryEntity('Test Category'),
      );
      jest
        .spyOn(repository, 'save')
        .mockRejectedValueOnce(new Error('Creation failed'));

      await expect(service.create(product)).rejects.toThrow('Creation failed');
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const product = new ProductEntity(
        'Test Product',
        'Test Description',
        10,
        10,
        'http://test.com',
        true,
        new CategoryEntity('Test Category'),
      );
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      await expect(service.update(1, product)).resolves.toBeUndefined();
      expect(repository.update).toHaveBeenCalledWith(1, product);
    });

    it('should throw an error if update fails', async () => {
      const product = new ProductEntity(
        'Test Product',
        'Test Description',
        10,
        10,
        'http://test.com',
        true,
        new CategoryEntity('Test Category'),
      );
      jest
        .spyOn(repository, 'update')
        .mockRejectedValueOnce(new Error('Update failed'));

      await expect(service.update(1, product)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete a product successfully', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      await expect(service.delete(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if deletion fails', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValueOnce(new Error('Deletion failed'));

      await expect(service.delete(1)).rejects.toThrow('Deletion failed');
    });
  });

  describe('findProducts', () => {
    it('should find products successfully', async () => {
      const products = [
        new ProductEntity(
          'Test Product',
          'Test Description',
          10,
          10,
          'http://test.com',
          true,
          new CategoryEntity('Test Category'),
        ),
      ];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(products);

      await expect(service.findProducts('name', 1)).resolves.toEqual(products);
      expect(repository.find).toHaveBeenCalledWith('name', 1);
    });

    it('should throw an error if finding products fails', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValueOnce(new Error('Find failed'));

      await expect(service.findProducts('name', 1)).rejects.toThrow(
        'Find failed',
      );
    });
  });
});
