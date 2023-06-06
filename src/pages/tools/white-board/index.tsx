import dynamic from 'next/dynamic';

const Excalidraw = dynamic(() => import('@excalidraw/excalidraw').then((r) => r.Excalidraw), {
  ssr: false,
});

const WhiteBoard = () => {
  return (
    <div style={{ height: '100dvh' }}>
      <Excalidraw />
    </div>
  );
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'White Board',
        description: 'White Board',
      },
    },
  };
};

export default WhiteBoard;
