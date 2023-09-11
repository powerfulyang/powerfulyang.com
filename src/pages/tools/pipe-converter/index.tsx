import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';
import { Reorder } from 'framer-motion';
import { useAtom, useAtomValue } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
import { decode, encode } from 'js-base64';
import { useMemo, useState } from 'react';

const _actions = [
  {
    name: 'Base64 decode',
    key: 'base64Decode',
    fn: (text: string) => {
      try {
        return decode(text);
      } catch {
        return text;
      }
    },
    checked: false,
  },
  {
    name: 'URL decode',
    key: 'urlDecode',
    fn: (text: string) => {
      try {
        return decodeURIComponent(text);
      } catch {
        return text;
      }
    },
    checked: false,
  },
  {
    name: 'JSON Format',
    key: 'jsonFormat',
    fn: (text: string) => {
      try {
        return JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        return text;
      }
    },
    checked: false,
  },
  {
    name: 'URL encode',
    key: 'urlEncode',
    fn: (text: string) => {
      return encodeURIComponent(text);
    },
    checked: false,
  },
  {
    name: 'Base64 encode',
    key: 'base64Encode',
    fn: (text: string) => {
      return encode(text);
    },
    checked: false,
  },
];

const ActionsAtom = atomWithImmer(_actions);

const PipeActions = () => {
  const [actions, setActions] = useAtom(ActionsAtom);
  return (
    <Reorder.Group axis="y" onReorder={setActions} values={actions} className="mt-2 grid gap-2">
      {actions.map((action) => {
        return (
          <Reorder.Item
            key={action.key}
            value={action}
            className="relative flex items-center rounded-lg border border-gray-200 pl-2"
          >
            <Checkbox
              checked={action.checked}
              id={action.key}
              onCheckedChange={(checked: boolean) => {
                setActions((items) => {
                  items.forEach((draft) => {
                    if (draft.key === action.key) {
                      draft.checked = checked;
                    }
                  });
                });
              }}
            />
            <Label className="h-full flex-1 p-2" htmlFor={action.key}>
              {action.name}
            </Label>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
};

const PipeConverter: LayoutFC = () => {
  const [text, setText] = useState('');
  const orderedActions = useAtomValue(ActionsAtom);
  const data = useMemo(() => {
    const enabledActions = orderedActions.filter((x) => x.checked).map((x) => x.fn);
    return enabledActions.reduce((previousValue, currentValue) => {
      return currentValue(previousValue);
    }, text);
  }, [orderedActions, text]);

  return (
    <div className="flex flex-col items-center space-y-4 p-10">
      <h3 className="text-3xl font-medium">Pipe Converter</h3>
      <span className="!mb-4 text-[#1b233d]/70">
        Pipe convert URL encode, base64, JSON parse etc.
      </span>
      <div className="grid w-[80%] max-w-[800px] gap-2">
        <Label className="text-base font-medium" htmlFor="Input">
          Input:
        </Label>
        <Textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
          rows={8}
          id="Input"
          placeholder="Please input your text"
        />
        <div className="mt-4">
          <Label className="text-base font-medium">Actions(Reorder by drag):</Label>
          <PipeActions />
        </div>
        <div className="mt-4">
          <Label className="text-base font-medium" htmlFor="Output">
            Output:
          </Label>
          <div className="mt-2 whitespace-pre-wrap break-all rounded border border-gray-200 p-2">
            {data}
          </div>
        </div>
      </div>
    </div>
  );
};

PipeConverter.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export default PipeConverter;

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Pipe Converter',
        description: 'Pipe convert URL encode, base64, JSON parse etc.',
      },
    },
  };
};
