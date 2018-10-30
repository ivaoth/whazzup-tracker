import { ValidatePipe } from './validate.pipe';

describe('ValidatePipe', () => {
  it('create an instance', () => {
    const pipe = new ValidatePipe();
    expect(pipe).toBeTruthy();
  });
});
