import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query, UpdateQuery } from 'mongoose';
import { ProductDocument } from './schemas/product.schema';
import { BaseProductDto } from './dto/base-product.dto';

const mockProduct = (
  name = 'tomato',
  category = 'vegetables',
  unit = 'kg',
  suppliers = [{ name: 'ali', price: 2020 }],
  stock = 13,
  _id = 'fake-id',
): BaseProductDto => ({
  name,
  category,
  unit,
  suppliers,
  stock,
  _id,
});

const mockProductDoc = (
  mock?: Partial<BaseProductDto>,
): Partial<ProductDocument> => ({
  name: mock?.name || 'tomato',
  category: mock?.category || 'vegetables',
  unit: mock?.unit || 'kg',
  suppliers: mock?.suppliers || [{ name: 'ali', price: 2020 }],
  stock: mock?.stock || 13,
  _id: mock?._id || 'fake-id',
});

const productArray = [
  mockProduct(),
  mockProduct('cucumber', 'fruit', 'kg', [{ name: 'ali', price: 2020 }], 2),
  mockProduct('carrot', 'vegetable', 'kg', [{ name: 'ali', price: 2020 }], 4),
];

const productDocArray: Partial<ProductDocument>[] = [
  mockProductDoc(),
  mockProductDoc({
    name: 'cucumber',
    category: 'fruit',
    unit: 'kg',
    suppliers: [{ name: 'ali', price: 2020 }],
    stock: 2,
  }),
  mockProductDoc({
    name: 'carrot',
    category: 'vegetable',
    unit: 'kg',
    suppliers: [{ name: 'ali', price: 2020 }],
    stock: 4,
  }),
];

describe('ProductService', () => {
  let service: ProductService;
  let model: Model<ProductDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken('Product'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockProduct()),
            constructor: jest.fn().mockResolvedValue(mockProduct()),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            create: jest.fn(),
            findByIdAndDelete: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    model = module.get<Model<ProductDocument>>(getModelToken('Product'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('service.findAll()', () => {
    it('should find and return all Products', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(productDocArray),
      } as unknown as Query<ProductDocument[], ProductDocument>);
      const result = await service.findAll();
      expect(result).toStrictEqual(productArray);
    });
  });

  describe('service.findOne()', () => {
    it('should find and return a Product by id', async () => {
      jest.spyOn(model, 'findById').mockImplementationOnce(
        (id?: string) =>
          ({
            exec: jest.fn().mockResolvedValueOnce(
              mockProductDoc({
                name: 'onion',
                category: 'vegetables',
                unit: 'kg',
                suppliers: [{ name: 'agha reza', price: 2200 }],
                stock: 13,
                _id: id,
              }),
            ),
          } as unknown as Query<ProductDocument, ProductDocument>),
      );
      const findMockProduct = mockProduct(
        'onion',
        'vegetables',
        'kg',
        [{ name: 'agha reza', price: 2200 }],
        13,
        'real-id',
      );
      const foundProduct = await service.findOne('real-id');
      expect(foundProduct).toEqual(findMockProduct);
    });

    it('should throw if product not found', async () => {
      jest.spyOn(model, 'findById').mockImplementationOnce(
        (id?: string) =>
          ({
            exec: jest.fn().mockResolvedValueOnce(
              id === 'fake-id'
                ? null
                : mockProductDoc({
                    name: 'onion',
                    category: 'vegetables',
                    unit: 'kg',
                    suppliers: [{ name: 'agha reza', price: 2200 }],
                    stock: 13,
                    _id: id,
                  }),
            ),
          } as unknown as Query<ProductDocument, ProductDocument>),
      );

      expect(service.findOne('fake-id')).rejects.toThrow('product not found');
    });
  });

  it('should insert a new Product', async () => {
    /**
     * I don't have the knowledge to mock the process of inserting a new Product
     * I don't know how to make a fake ProductDocument instance to use as:
     * jest.spyOn(model, 'create').mockImplementation(....)
     */
  });

  describe('service.update()', () => {
    it('should delete a product successfully', async () => {
      jest.spyOn(model, 'findById').mockImplementationOnce(
        (id?: string) =>
          ({
            exec: jest.fn().mockResolvedValueOnce(
              mockProductDoc({
                name: 'onion',
                category: 'vegetables',
                unit: 'kg',
                suppliers: [{ name: 'agha reza', price: 2200 }],
                stock: 13,
                _id: id,
              }),
            ),
          } as unknown as Query<ProductDocument, ProductDocument>),
      );

      jest.spyOn(model, 'findByIdAndUpdate').mockImplementationOnce(
        (id: any, update: UpdateQuery<ProductDocument>) =>
          ({
            exec: jest.fn().mockResolvedValueOnce(
              mockProductDoc({
                name: 'onion',
                category: 'vegetables',
                unit: 'kg',
                suppliers: [{ name: 'agha reza', price: 2200 }],
                stock: update.stock,
                _id: id,
              }),
            ),
          } as unknown as Query<ProductDocument, ProductDocument>),
      );
      const updateMockProduct = mockProduct(
        'onion',
        'vegetables',
        'kg',
        [{ name: 'agha reza', price: 2200 }],
        4,
        'real-id',
      );
      const foundProduct = await service.update('real-id', { stock: 4 });
      expect(foundProduct).toEqual(updateMockProduct);
    });

    it('should throw if product not found', async () => {
      jest.spyOn(model, 'findById').mockImplementationOnce(
        (id?: string) =>
          ({
            exec: jest.fn().mockResolvedValueOnce(
              id === 'fake-id'
                ? null
                : mockProductDoc({
                    name: 'onion',
                    category: 'vegetables',
                    unit: 'kg',
                    suppliers: [{ name: 'agha reza', price: 2200 }],
                    stock: 13,
                    _id: id,
                  }),
            ),
          } as unknown as Query<ProductDocument, ProductDocument>),
      );

      expect(service.update('fake-id', { stock: 2 })).rejects.toThrow(
        'product not found',
      );
    });
  });

  describe('service.delete()', () => {
    it('should delete a product successfully', async () => {
      jest.spyOn(model, 'findById').mockImplementationOnce(
        (id?: string) =>
          ({
            exec: jest.fn().mockResolvedValueOnce(
              mockProductDoc({
                name: 'onion',
                category: 'vegetables',
                unit: 'kg',
                suppliers: [{ name: 'agha reza', price: 2200 }],
                stock: 13,
                _id: id,
              }),
            ),
          } as unknown as Query<ProductDocument, ProductDocument>),
      );

      jest.spyOn(model, 'findByIdAndDelete').mockImplementationOnce(
        (id?: string) =>
          ({
            exec: jest.fn().mockResolvedValueOnce(
              mockProductDoc({
                name: 'onion',
                category: 'vegetables',
                unit: 'kg',
                suppliers: [{ name: 'agha reza', price: 2200 }],
                stock: 13,
                _id: id,
              }),
            ),
          } as unknown as Query<ProductDocument, ProductDocument>),
      );
      const findMockProduct = mockProduct(
        'onion',
        'vegetables',
        'kg',
        [{ name: 'agha reza', price: 2200 }],
        13,
        'real-id',
      );
      const foundProduct = await service.remove('real-id');
      expect(foundProduct).toEqual(findMockProduct);
    });

    it('should throw if product not found', async () => {
      jest.spyOn(model, 'findById').mockImplementationOnce(
        (id?: string) =>
          ({
            exec: jest.fn().mockResolvedValueOnce(
              id === 'fake-id'
                ? null
                : mockProductDoc({
                    name: 'onion',
                    category: 'vegetables',
                    unit: 'kg',
                    suppliers: [{ name: 'agha reza', price: 2200 }],
                    stock: 13,
                    _id: id,
                  }),
            ),
          } as unknown as Query<ProductDocument, ProductDocument>),
      );

      expect(service.remove('fake-id')).rejects.toThrow('product not found');
    });
  });
});
