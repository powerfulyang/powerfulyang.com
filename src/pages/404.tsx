import { Button } from '@powerfulyang/components';
import { useRouter } from 'next/router';

const _404 = () => {
  const router = useRouter();
  const backHome = () => {
    return router.push('/');
  };
  return (
    <div className="p-20 text-center">
      <div className="mb-10">Sorry, the page you visited does not exist.</div>
      <Button onClick={backHome} className="pointer bg-purple-500" appearance="primary">
        Back to Home
      </Button>
    </div>
  );
};

export default _404;
