import { Test, TestingModule } from '@nestjs/testing';
import { SmeloansService } from './smeloans.service';

describe('SmeloansService', () => {
  let service: SmeloansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmeloansService],
    }).compile();

    service = module.get<SmeloansService>(SmeloansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
