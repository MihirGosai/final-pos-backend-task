import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from '../schemas/product.schema';
import { CreateProductDto } from '../dto/create-product.dto';

/** constructor-style mock for Mongoose Model<Product> */
class ProductModelMock {
  public save: jest.Mock;

  constructor(private data: any) {
    this.save = jest.fn().mockResolvedValue({ _id: '1', ...this.data });
  }

  /* static helpers used in service */
  static find = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([{ _id: '99', name: 'Sample' }]),
  });
  static findById = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(null),
  });
  static findByIdAndUpdate = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(null),
  });
  static findByIdAndDelete = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(null),
  });
}

describe('ProductService (unit)', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: ProductModelMock,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a product and returns the saved document', async () => {
    const dto: CreateProductDto = {
      name: 'Test Product',
      price: 10,
      stock: 5,
      image: 'data:image/png;base64,...',
      description: 'A test product',
    };

    const res = await service.create(dto);
    expect(res).toEqual({ _id: '1', ...dto });
  });

  it('findAll returns list of products', async () => {
    const list = await service.findAll();
    expect(ProductModelMock.find).toHaveBeenCalled();
    expect(list).toEqual([{ _id: '99', name: 'Sample' }]);
  });
});
