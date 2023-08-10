import styles from './loading.module.scss';

const Loading = () => {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className={styles.loading}>Loading</div>
    </div>
  );
};

export default Loading;
