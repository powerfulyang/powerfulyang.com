import { useEffect, useState } from 'react';
import { fromEvent } from 'rxjs';

function isDocumentVisible() {
  return !document.hidden;
}

export const useDocumentVisible = () => {
  const [visible, setVisible] = useState(() => true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setVisible(isDocumentVisible());
    };

    const subscription = fromEvent(document, 'visibilitychange').subscribe(handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return visible;
};
