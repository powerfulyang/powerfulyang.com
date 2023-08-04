import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import Post from '@/pages/post';

describe('Post', () => {
  it('render', () => {
    render(<Post posts={[]} years={[2022, 2021]} year={2022} />);
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument();
  });
});
