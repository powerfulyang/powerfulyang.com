import Lottie from 'lottie-react';
import NotFound from '@/lottie/NotFound.json';
import { Button } from '@powerfulyang/components';
import { useHistory } from '@/hooks/useHistory';

const _404 = () => {
  const history = useHistory();
  const backHome = () => {
    history.pushState('/');
  };
  return (
    <div className="text-center">
      <Lottie className="m-auto h-[80vh]" animationData={NotFound} />
      <Button onClick={backHome} className="pointer bg-purple-500 sm:mt-10" appearance="primary">
        Back to Home
      </Button>
    </div>
  );
};

export default _404;
