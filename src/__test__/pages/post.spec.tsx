import { queryClient } from '@/context/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import Post from '@/pages/post';

describe('Post', () => {
  it('render', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Post posts={[]} years={[2022, 2021]} year={2022} nextCursor={0} prevCursor={0} />
      </QueryClientProvider>,
    );
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument();
    const _2022 = screen.getByText('#2022');
    expect(_2022).toBeInTheDocument();
  });
});
