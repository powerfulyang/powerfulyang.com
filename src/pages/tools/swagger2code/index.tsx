const Swagger2code = () => {
  return <div>1</div>;
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'swagger2code',
        description: 'convert swagger to typescript code, such as antd',
      },
    },
  };
};

export default Swagger2code;
