import { describe, expect, it } from '@jest/globals';
import { getSchemaName } from '@/services/swagger-parse/getSchemaName';

describe('swagger utils', () => {
  it('getSchemaName v3', () => {
    const name = getSchemaName('#/components/schemas/MySchema');
    expect(name).toBe('MySchema');
  });

  it('getSchemaName v2', () => {
    const name = getSchemaName('#/definitions/MySchema');
    expect(name).toBe('MySchema');
  });
});
