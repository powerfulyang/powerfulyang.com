import { useState, useEffect } from 'react';
import type { MotionValue } from 'framer-motion';
import { Reorder, useMotionValue, animate } from 'framer-motion';

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)';

export function useRaisedShadow(value: MotionValue<number>) {
  const boxShadow = useMotionValue(inactiveShadow);

  useEffect(() => {
    let isActive = false;
    const unsubscribe = value.on('change', (latest) => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          animate(boxShadow, '5px 5px 10px rgba(0,0,0,0.3)');
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [value, boxShadow]);

  return boxShadow;
}

interface Props {
  item: string;
}

const Item = ({ item }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item
      className="pointer relative mb-4 rounded-lg bg-white p-4"
      value={item}
      id={item}
      style={{ boxShadow, y }}
      whileDrag={{ scale: 1.05 }}
    >
      <span>{item}</span>
    </Reorder.Item>
  );
};

const initialItems = ['🍅 Tomato', '🥒 Cucumber', '🧀 Cheese', '🥬 Lettuce'];

const _Reorder = () => {
  const [items, setItems] = useState(initialItems);

  return (
    <div className="flex h-[100dvh] items-center justify-center bg-yellow-400">
      <Reorder.Group className="w-[300px]" axis="y" onReorder={setItems} values={items}>
        {items.map((item) => (
          <Item key={item} item={item} />
        ))}
      </Reorder.Group>
    </div>
  );
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Reorder - framer-motion',
        description: 'Reorder demo from framer-motion',
      },
    },
  };
};

export default _Reorder;
