import { Button } from '@powerfulyang/components';
import { useHistory } from '@/hooks/useHistory';

const _404 = () => {
  const history = useHistory();
  const backHome = () => {
    return history.pushState('/');
  };
  return (
    <div className="p-10 text-center">
      <div>404</div>
      <Button onClick={backHome} className="pointer bg-purple-500" appearance="primary">
        Back to Home
      </Button>
    </div>
  );
};

export default _404;
