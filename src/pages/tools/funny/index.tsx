import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';
import Link from 'next/link';

const App: LayoutFC = () => {
  return (
    <div className="flex gap-5 p-14">
      <Link className="link" href="/tools/funny/firefiles">
        萤火虫
      </Link>
      <Link className="link" href="/tools/funny/bananas">
        香蕉
      </Link>
    </div>
  );
};

App.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: '有趣的玩意',
        description: '有趣的 webgl',
      },
    },
  };
};

export default App;
