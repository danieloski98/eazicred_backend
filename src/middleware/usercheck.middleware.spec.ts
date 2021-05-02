import { UsercheckMiddleware } from './usercheck.middleware';

describe('UsercheckMiddleware', () => {
  it('should be defined', () => {
    expect(new UsercheckMiddleware()).toBeDefined();
  });
});
