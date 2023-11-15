import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();
  const backHome = () => {
    return router.push('/');
  };
  return (
    <div className="p-20 text-center">
      <div className="mb-10">Sorry, the page you visited does not exist.</div>
      <Button onClick={backHome}>Back to Home</Button>
    </div>
  );
};

export default NotFound;
