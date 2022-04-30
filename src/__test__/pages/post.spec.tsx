import { render, screen } from '@testing-library/react';
import Post from '@/pages/post';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

describe('Post', () => {
  it('render', () => {
    render(<Post posts={[]} years={[2022, 2021]} year={2022} />);
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument();
  });
});
