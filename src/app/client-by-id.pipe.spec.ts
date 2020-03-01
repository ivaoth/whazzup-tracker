import { ClientByIdPipe } from './client-by-id.pipe';

describe('ClientByIdPipe', () => {
  it('create an instance', () => {
    const pipe = new ClientByIdPipe();
    expect(pipe).toBeTruthy();
  });
});
