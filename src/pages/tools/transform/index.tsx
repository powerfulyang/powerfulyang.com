import { NoSSRMonacoEditor } from '@/components/monaco-editor';
import { PrismCode } from '@/components/PrismCode';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Action, useTransform } from '@/hooks/useTransform';
import { cn } from '@/lib/utils';
import styles from '@/styles/content.module.scss';
import { getEnumValues } from '@powerfulyang/utils';

const Transform = () => {
  const { action, setAction, value, setValue, result } = useTransform();

  return (
    <div className={cn('flex w-full flex-col', styles.nonLayoutContent)}>
      <div className="flex items-center px-4 py-1">
        <Label className="flex items-center gap-2">
          <span>Action:</span>
          <Select
            value={action}
            onValueChange={(_value: Action) => {
              setAction(_value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Action" />
            </SelectTrigger>
            <SelectContent>
              {getEnumValues(Action).map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
      </div>
      <div className="flex flex-1 divide-x divide-dashed divide-gray-400 border-t border-dashed border-amber-400">
        <div className="w-1/2 py-2">
          <NoSSRMonacoEditor
            language="html"
            options={{
              minimap: { enabled: false },
            }}
            value={value}
            onChange={(_value) => {
              setValue(_value || '');
            }}
          />
        </div>
        <div className="w-1/2 px-4 py-2">
          <PrismCode language="jsx">{result}</PrismCode>
        </div>
      </div>
    </div>
  );
};

export default Transform;

export const getStaticProps = () => {
  return {
    props: {
      meta: {
        title: 'Transform',
        description: 'Transform HTML to JSX',
      },
    },
  };
};
