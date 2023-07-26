import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';
import Link from 'next/link';

const App: LayoutFC = () => {
  return (
    <div className="flex gap-5 p-14">
      <Link className="link" href="/tools/funny/fireflies">
        萤火虫
      </Link>
      <Link className="link" href="/tools/funny/bananas">
        香蕉
      </Link>
      <Link className="link" href="/tools/funny/basics/Textures">
        纹理
      </Link>
      <Link className="link" href="/tools/funny/basics/Text3D">
        Text3D
      </Link>
      <Link className="link" href="/tools/funny/classic-techniques/galaxy-generator">
        galaxy-generator
      </Link>
      <Link className="link" href="/tools/funny/levels/level1">
        level1
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
