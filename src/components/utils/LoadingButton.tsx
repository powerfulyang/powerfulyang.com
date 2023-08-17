import { forwardRef } from 'react';
import type { ButtonProps } from '../ui/button';
import { Button } from '../ui/button';
import { Icons } from '../icons';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading, ...props }, ref) => {
    return (
      <Button disabled={loading} {...props} ref={ref}>
        {loading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
        {props.children}
      </Button>
    );
  },
);

LoadingButton.displayName = 'LoadingButton';
