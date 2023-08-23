import { describe, expect, it } from '@jest/globals';
import { html2jsx } from '@/utils/html2jsx';

describe('html2jsx', () => {
  it('should convert html to jsx', async () => {
    const html = '<div style="text-align: center">foo</div>';
    const result = await html2jsx(html);
    expect(result).toBe(
      'export const Foo = () => {\n' +
        '  return <div style={{ textAlign: "center" }}>foo</div>;\n' +
        '};\n',
    );
  });
});
