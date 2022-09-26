import RocketShip from '@/lottie/RocketShip.json';
import Lottie from 'lottie-react';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const useScrollHeight = () => {
  const [scrollHeight, setScrollHeight] = React.useState(0);
  React.useEffect(() => {
    const handleScroll = () => {
      setScrollHeight(document.documentElement.scrollTop);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return scrollHeight;
};

export const BackToTop = () => {
  const scrollHeight = useScrollHeight();
  return (
    <AnimatePresence>
      {scrollHeight > 100 && (
        <motion.div
          title="Back to top"
          className="pointer fixed bottom-28 right-10 hidden w-28 sm:block"
          transition={{
            duration: 0.3,
            type: 'keyframes',
            ease: 'easeOut',
          }}
          initial={{
            opacity: 0,
            y: '-80px',
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: '-80vh',
          }}
        >
          <Lottie
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            }}
            animationData={RocketShip}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
