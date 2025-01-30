import { CategoryEntity } from '@Domain/entities/category.entity';
import { ProductEntity } from '@Domain/entities/product.entity';
import { ProductMapper } from '@Infrastructure/typeorm/mappers/product.mapper';
import { CategoryModel } from '@Infrastructure/typeorm/models/category.model';
import { ProductModel } from '@Infrastructure/typeorm/models/product.model';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ProductRepositoryImpl } from './product.repository.impl';

describe('ProductRepositoryImpl', () => {
  let productRepository: ProductRepositoryImpl;
  let repository: Repository<ProductModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepositoryImpl,
        { provide: getRepositoryToken(ProductModel), useClass: Repository },
      ],
    }).compile();

    productRepository = module.get<ProductRepositoryImpl>(
      ProductRepositoryImpl,
    );
    repository = module.get<Repository<ProductModel>>(
      getRepositoryToken(ProductModel),
    );
  });

  it('should save a product successfully', async () => {
    const productEntity: ProductEntity = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      enabled: true,
      price: 10,
      figureUrl: 'http://test.com',
      preparationTime: 10,
      category: { id: 1 } as CategoryEntity,
    };
    const productModel: ProductModel = {
      id: 1,
      name: 'Test Product',
      createdAt: new Date(),
      category: { id: 1 } as CategoryModel,
      description: 'Test Description',
      enabled: true,
      price: 10,
      figureUrl: 'http://test.com',
      preparationTime: 10,
    };

    jest.spyOn(ProductMapper, 'toModel').mockReturnValue(productModel);
    jest.spyOn(repository, 'save').mockResolvedValue(productModel);

    await productRepository.save(productEntity);

    expect(repository.save).toHaveBeenCalledWith(productModel);
  });

  it('should handle errors when saving a product', async () => {
    const productEntity: ProductEntity = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      enabled: true,
      price: 10,
      figureUrl: 'http://test.com',
      preparationTime: 10,
      category: { id: 1 } as CategoryEntity,
    };

    jest
      .spyOn(repository, 'save')
      .mockRejectedValue(new Error('Error saving product'));

    await expect(productRepository.save(productEntity)).rejects.toThrow(
      'Error saving product',
    );
  });

  it('should find a product by id successfully', async () => {
    const productModel: ProductModel = {
      id: 1,
      name: 'Test Product',
      createdAt: new Date(),
      category: { id: 1 } as CategoryModel,
      description: 'Test Description',
      enabled: true,
      price: 10,
      figureUrl: 'http://test.com',
      preparationTime: 10,
    };
    const productEntity: ProductEntity = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      enabled: true,
      price: 10,
      figureUrl: 'http://test.com',
      preparationTime: 10,
      category: { id: 1 } as CategoryEntity,
    };

    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(productModel);
    jest.spyOn(ProductMapper, 'toEntity').mockReturnValue(productEntity);

    const result = await productRepository.findById(1);

    expect(result).toEqual(productEntity);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['category'],
    });
  });

  it('should handle undefined return when finding products', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([]);

    const result = await productRepository.find('Nonexistent Product', 1);

    expect(result).toEqual([]);
    expect(repository.find).toHaveBeenCalledWith({
      where: {
        name: ILike('%Nonexistent Product%'),
        category: { id: 1 },
      },
      relations: ['category'],
      order: { price: 'DESC' },
      loadEagerRelations: true,
    });
  });

  it('should handle errors when finding a product by id', async () => {
    jest
      .spyOn(repository, 'findOne')
      .mockRejectedValue(new Error('Error finding product'));

    await expect(productRepository.findById(1)).rejects.toThrow(
      'Error finding product',
    );
  });

  it('should return undefined when product is not found by id', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(ProductMapper, 'toEntity').mockImplementation((model) => {
      if (!model) return undefined;
      return {
        id: model.id,
        name: model.name,
        description: model.description,
        enabled: model.enabled,
        price: model.price,
        figureUrl: model.figureUrl,
        preparationTime: model.preparationTime,
        category: { id: model.category.id } as CategoryEntity,
      };
    });

    const result = await productRepository.findById(1);
    expect(result).toBeUndefined();
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['category'],
    });
  });

  it('should find products successfully', async () => {
    const productModels: ProductModel[] = [
      {
        id: 1,
        name: 'Test Product',
        createdAt: new Date(),
        category: { id: 1 } as CategoryModel,
        description: 'Test Description',
        enabled: true,
        price: 10,
        figureUrl: 'http://test.com',
        preparationTime: 10,
      },
    ];
    const productEntities: ProductEntity[] = [
      {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        enabled: true,
        price: 10,
        figureUrl: 'http://test.com',
        preparationTime: 10,
        category: { id: 1 } as CategoryEntity,
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(productModels);
    jest
      .spyOn(ProductMapper, 'toEntity')
      .mockImplementation((model) =>
        productEntities.find((entity) => entity.id === model.id),
      );

    const result = await productRepository.find('Test Product', 1);

    expect(result).toEqual(productEntities);
    expect(repository.find).toHaveBeenCalledWith({
      where: {
        name: ILike('%Test Product%'),
        category: { id: 1 },
      },
      relations: ['category'],
      order: { price: 'DESC' },
      loadEagerRelations: true,
    });
  });

  it('should handle errors when finding products', async () => {
    jest
      .spyOn(repository, 'find')
      .mockRejectedValue(new Error('Error finding products'));

    await expect(productRepository.find('Test Product', 1)).rejects.toThrow(
      'Error finding products',
    );
  });

  it('should return an empty array when no products are found', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([]);

    const result = await productRepository.find('Nonexistent Product', 1);

    expect(result).toEqual([]);
    expect(repository.find).toHaveBeenCalledWith({
      where: {
        name: ILike('%Nonexistent Product%'),
        category: { id: 1 },
      },
      relations: ['category'],
      order: { price: 'DESC' },
      loadEagerRelations: true,
    });
  });

  it('should update a product successfully', async () => {
    const productEntity: ProductEntity = {
      id: 1,
      name: 'Updated Product',
      description: 'Updated Description',
      enabled: true,
      price: 20,
      figureUrl: 'http://updated.com',
      preparationTime: 20,
      category: { id: 1 } as CategoryEntity,
    };
    const productModel: ProductModel = {
      id: 1,
      name: 'Updated Product',
      createdAt: new Date(),
      category: { id: 1 } as CategoryModel,
      description: 'Updated Description',
      enabled: true,
      price: 20,
      figureUrl: 'http://updated.com',
      preparationTime: 20,
    };

    jest.spyOn(ProductMapper, 'toModel').mockReturnValue(productModel);
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);

    await productRepository.update(1, productEntity);

    expect(repository.update).toHaveBeenCalledWith(1, { ...productModel });
  });

  it('should handle errors when updating a product', async () => {
    const productEntity: ProductEntity = {
      id: 1,
      name: 'Updated Product',
      description: 'Updated Description',
      enabled: true,
      price: 20,
      figureUrl: 'http://updated.com',
      preparationTime: 20,
      category: { id: 1 } as CategoryEntity,
    };

    jest
      .spyOn(repository, 'update')
      .mockRejectedValue(new Error('Error updating product'));

    await expect(productRepository.update(1, productEntity)).rejects.toThrow(
      'Error updating product',
    );
  });

  it('should delete a product successfully', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

    await productRepository.delete(1);

    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should handle errors when deleting a product', async () => {
    jest
      .spyOn(repository, 'delete')
      .mockRejectedValue(new Error('Error deleting product'));

    await expect(productRepository.delete(1)).rejects.toThrow(
      'Error deleting product',
    );
  });

  it('should handle validation errors when saving a product', async () => {
    const productEntity: ProductEntity = {
      id: 1,
      name: 'Invalid Product',
      description: 'Invalid Description',
      enabled: true,
      price: -10, // Invalid price
      figureUrl: 'http://test.com',
      preparationTime: 10,
      category: { id: 1 } as CategoryEntity,
    };

    jest
      .spyOn(repository, 'save')
      .mockRejectedValue(new Error('Validation error'));

    await expect(productRepository.save(productEntity)).rejects.toThrow(
      'Validation error',
    );
  });

  it('should handle undefined name when finding products', async () => {
    const productModels: ProductModel[] = [
      {
        id: 1,
        name: 'Test Product',
        createdAt: new Date(),
        category: { id: 1 } as CategoryModel,
        description: 'Test Description',
        enabled: true,
        price: 10,
        figureUrl: 'http://test.com',
        preparationTime: 10,
      },
    ];
    const productEntities: ProductEntity[] = [
      {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        enabled: true,
        price: 10,
        figureUrl: 'http://test.com',
        preparationTime: 10,
        category: { id: 1 } as CategoryEntity,
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(productModels);
    jest
      .spyOn(ProductMapper, 'toEntity')
      .mockImplementation((model) =>
        productEntities.find((entity) => entity.id === model.id),
      );

    const result = await productRepository.find(undefined, 1);

    expect(result).toEqual(productEntities);
    expect(repository.find).toHaveBeenCalledWith({
      where: {
        name: undefined,
        category: { id: 1 },
      },
      relations: ['category'],
      order: { price: 'DESC' },
      loadEagerRelations: true,
    });
  });
});
