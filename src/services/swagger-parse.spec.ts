import { swaggerParse } from '@/services/swagger-parse';
import { describe, expect, it } from '@jest/globals';

describe('swagger parse', () => {
  it('backend api', async () => {
    const res = await swaggerParse('https://api.powerfulyang.com/api/swagger-json');
    expect(res).toHaveProperty('info');
  });
});
