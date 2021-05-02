import { Test, TestingModule } from '@nestjs/testing';
import { PaydayloansService } from './paydayloans.service';

describe('PaydayloansService', () => {
  let service: PaydayloansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaydayloansService],
    }).compile();

    service = module.get<PaydayloansService>(PaydayloansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
