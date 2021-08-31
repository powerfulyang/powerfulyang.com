import { handlePaste } from '@/utils/copy';
import { useState, ClipboardEvent } from 'react';

const Copy = () => {
  const [s, setS] = useState<any>();
  const paste = async (e: ClipboardEvent) => {
    const result = await handlePaste(e);
    setS(result);
  };
  return (
    <>
      <div
        className="w-full"
        style={{
          height: '100px',
          border: '1px solid black',
          cursor: 'text',
        }}
        contentEditable
        onPaste={paste}
      />
      {JSON.stringify(s, null, 2)}
    </>
  );
};

export default Copy;
