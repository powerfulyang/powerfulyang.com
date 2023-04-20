import { render, screen } from '@testing-library/react';
import Post from '@/pages/post';
import { describe, expect, it } from '@jest/globals';

describe('Post', () => {
  it('render', () => {
    render(<Post posts={[]} years={[2022, 2021]} year={2022} />);
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument();
  });
});
