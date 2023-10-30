import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';
import { extractURLParams } from '@powerfulyang/utils';
import { ArrowDownUp, Star } from 'lucide-react';
import React, { useMemo, useState } from 'react';

const UrlParamsExtractor: LayoutFC = () => {
  const [url, setUrl] = useState<string>(
    'https://www.youzan.com?name=coder&age=20&callback=https%3A%2F%2Fyouzan.com%3Fname%3Dtest&list[]=a&json=%7B%22str%22%3A%22abc%22,%22num%22%3A123%7D',
  );
  const [recursiveKeys, setRecursiveKeys] = useState<string[]>([]);
  const [favoriteKeys, setFavoriteKeys] = useState<string[]>([]);
  const [recursive, setRecursive] = useState<boolean>(false);

  const data = useMemo(() => {
    const res = extractURLParams(url, {
      recursiveKeys,
      favoriteKeys,
      recursive,
    });
    return Array.from(res.entries()).map(([key, value]) => {
      return {
        key,
        value,
      };
    });
  }, [favoriteKeys, recursive, recursiveKeys, url]);

  return (
    <div className="flex flex-col items-center space-y-4 p-10">
      <h3 className="text-3xl font-medium">URL Params Extractor</h3>
      <div className="!mb-4 text-[#1b233d]/70">Extract URL params from a URL</div>
      <Input
        placeholder="请输入 URL"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
      />
      <div className="mt-2 flex w-full items-center space-x-2">
        <Switch id="recursive" checked={recursive} onCheckedChange={setRecursive} />
        <Label className="cursor-pointer" htmlFor="recursive">
          递归解析带 & 和 = 的 Value
        </Label>
      </div>
      <DataTable
        className="mt-2 w-full"
        data={data || []}
        columns={[
          {
            accessorKey: 'key',
            header: 'Key',
            // eslint-disable-next-line react/no-unstable-nested-components
            cell: ({ row }) => {
              const isFavorite = favoriteKeys.includes(row.original.key);
              const isRecursive = recursiveKeys.includes(row.original.key);
              const canRecursive =
                (row.original.value.includes('&') || row.original.value.includes('=')) &&
                !recursive;
              return (
                <div className="flex items-center space-x-2">
                  <Star
                    className="cursor-pointer"
                    size={15}
                    color={isFavorite ? '#f5c518' : undefined}
                    onClick={() => {
                      if (isFavorite) {
                        setFavoriteKeys(favoriteKeys.filter((key) => key !== row.original.key));
                      } else {
                        setFavoriteKeys([...favoriteKeys, row.original.key]);
                      }
                    }}
                  />
                  <span>{row.original.key}</span>
                  {canRecursive && (
                    <ArrowDownUp
                      className="cursor-pointer"
                      size={15}
                      color={isRecursive ? '#f5c518' : undefined}
                      onClick={() => {
                        if (isRecursive) {
                          setRecursiveKeys(recursiveKeys.filter((key) => key !== row.original.key));
                        } else {
                          setRecursiveKeys([...recursiveKeys, row.original.key]);
                        }
                      }}
                    />
                  )}
                </div>
              );
            },
          },
          {
            accessorKey: 'value',
            header: 'Value',
            // eslint-disable-next-line react/no-unstable-nested-components
            cell: ({ row }) => {
              return <span className="break-all">{row.original.value}</span>;
            },
          },
        ]}
      />
    </div>
  );
};

export default UrlParamsExtractor;

UrlParamsExtractor.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export const getStaticProps = () => {
  return {
    props: {
      meta: {
        title: 'URL Params Extractor',
        description: 'Extract URL params from a URL',
      },
    },
  };
};
