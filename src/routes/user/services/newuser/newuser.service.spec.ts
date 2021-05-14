import { Test, TestingModule } from '@nestjs/testing';
import { NewuserService } from './newuser.service';

describe('NewuserService', () => {
  let service: NewuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewuserService],
    }).compile();

    service = module.get<NewuserService>(NewuserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
