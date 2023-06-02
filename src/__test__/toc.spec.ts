import { generateTOC } from '@/utils/toc';
import { describe, expect, it } from '@jest/globals';
import dayjs from 'dayjs';

describe('TOC', () => {
  it('should generate TOC', async () => {
    const content = `# 1`;
    const result = await generateTOC(content);
    expect(result).toStrictEqual([
      {
        level: 1,
        id: '1',
        title: '1',
      },
    ]);
  });

  it('dayjs', () => {
    const d = dayjs('12:08:23', 'HH:mm:ss');
    const f = d.format('HH:mm:ss');
    expect(f).toBe('12:08:23');
  });
});
