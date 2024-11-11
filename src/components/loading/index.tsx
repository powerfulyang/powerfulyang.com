import styles from './loading.module.scss';

const Index = () => {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className={styles.loading}>Loading</div>
    </div>
  );
};

export default Index;
