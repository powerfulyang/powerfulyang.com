import RocketShip from '@/lottie/RocketShip.json';
import Lottie from 'lottie-react';
import React from 'react';
import { useScrollDirection } from '@powerfulyang/hooks';
import { AnimatePresence, motion } from 'framer-motion';

export const BackToTop = () => {
  const { isDown } = useScrollDirection();
  return (
    <AnimatePresence>
      {isDown && (
        <motion.div
          title="Back to top"
          className="pointer fixed bottom-28 right-10 w-28"
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
