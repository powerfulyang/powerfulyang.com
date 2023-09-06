import Link from 'next/link';
import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const App: LayoutFC = () => {
  return (
    <div className="flex flex-col gap-5 p-14">
      <Card>
        <CardHeader>
          <CardTitle>R3F</CardTitle>
        </CardHeader>
        <CardContent className="space-x-5">
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
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>framer-motion</CardTitle>
        </CardHeader>
        <CardContent className="space-x-5">
          <Link className="link" href="/tools/funny/framer-motion/reorder">
            Reorder
          </Link>
        </CardContent>
      </Card>
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
