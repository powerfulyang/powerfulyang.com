import { MarkdownContainer } from '@/components/MarkdownContainer';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';

describe('md', () => {
  it('render', () => {
    const md = `# 2022\n## 2022-01-01\n发布了 [2022-01-01](/post/2022-01-01)。`;
    const result = render(<MarkdownContainer source={md} />);
    expect(result.container).toMatchSnapshot();
  });
});
