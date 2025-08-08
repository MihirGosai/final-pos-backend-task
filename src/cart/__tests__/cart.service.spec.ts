import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { getModelToken } from '@nestjs/mongoose';
import { Cart } from '../schemas/cart.schema';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

/**
 * Flexible mock that behaves both as a constructor (`new`) and
 * exposes `find`, `findById…` etc. directly.
 */
const CartModelMock: any = jest.fn().mockImplementation((data) => ({
  save: jest.fn().mockResolvedValue(data),
}));

CartModelMock.find = jest.fn().mockReturnValue({
  populate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([]),
  }),
});
CartModelMock.findById = jest.fn().mockReturnValue({
  exec: jest.fn().mockResolvedValue(null),
});
CartModelMock.findByIdAndUpdate = jest.fn().mockReturnValue({
  exec: jest.fn().mockResolvedValue(null),
});
CartModelMock.findByIdAndDelete = jest.fn().mockReturnValue({
  exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
});

describe('CartService (unit)', () => {
  let service: CartService;

  beforeEach(async () => {
    // default axios mocks
    mockedAxios.get.mockResolvedValue({
      data: { stock: 10, price: 5, name: 'Prod' },
    });
    mockedAxios.put.mockResolvedValue({ data: {} });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getModelToken(Cart.name),
          useValue: CartModelMock,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns empty list', async () => {
    const carts = await service.findAll();
    expect(CartModelMock.find).toHaveBeenCalled();
    expect(carts).toEqual([]);
  });

  it('create rejects when stock is insufficient', async () => {
    mockedAxios.get.mockResolvedValue({ data: { stock: 1, price: 5 } });

    await expect(
      service.create({
        userId: 'u1',
        items: [{ productId: 'p1', quantity: 99 }],
      } as any),
    ).rejects.toThrow();
  });

  it('create succeeds when stock is available', async () => {
    mockedAxios.get.mockResolvedValue({ data: { stock: 20, price: 5 } });

    const dto = {
      userId: 'u1',
      items: [{ productId: 'p1', quantity: 2 }],
    };

    const res = await service.create(dto as any);
    expect(res.userId).toBe('u1');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedAxios.put).toHaveBeenCalled(); // stock deducted
  });
});
