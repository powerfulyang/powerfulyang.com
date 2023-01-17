import { Button } from '@powerfulyang/components';
import { useHistory } from '@/hooks/useHistory';

const _404 = () => {
  const history = useHistory();
  const backHome = () => {
    return history.pushState('/');
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
