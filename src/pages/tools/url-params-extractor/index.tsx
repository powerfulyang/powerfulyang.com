import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';
import { copyToClipboardAndNotify } from '@/utils/copy';
import { CopyAllOutlined } from '@mui/icons-material';
import { Container, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';

const UrlParamsExtractor: LayoutFC = () => {
  const [url, setUrl] = useState<string>('');
  const [deepField, setDeepField] = useState<string>('');
  const [filterField, setFilterField] = useState<string>('');

  const params = useMemo(() => {
    const _params = new URLSearchParams(url.split('?')[1]);
    const result: [string, string][] = [];
    Array.from(_params.entries()).forEach(([key, value]) => {
      result.push([key, value]);
      if (deepField === key) {
        const __params = new URLSearchParams(value.split('?')[1]);
        Array.from(__params.entries()).forEach(([_key, _value]) => {
          result.push([_key, _value]);
        });
      }
    });
    return result.filter((item) => {
      if (filterField) {
        return filterField.split(',').includes(item[0]);
      }
      return true;
    });
  }, [url, deepField, filterField]);

  return (
    <Container className="flex flex-col items-center space-y-4 p-10" maxWidth="lg">
      <TextField
        fullWidth
        label="请输入 url"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
      />
      <TextField
        fullWidth
        label="字段深度解析"
        value={deepField}
        onChange={(e) => {
          setDeepField(e.target.value);
        }}
      />
      <TextField
        fullWidth
        label="筛选显示字段，用逗号分割"
        value={filterField}
        onChange={(e) => {
          setFilterField(e.target.value);
        }}
      />
      {params.map((item, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            <span>
              key{index}: {item[0]}
              <CopyAllOutlined
                sx={{
                  ml: 1,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  copyToClipboardAndNotify(item[0]);
                }}
              />
            </span>
            <br />
            <span>
              value{index}: {item[1]}
              <CopyAllOutlined
                sx={{
                  ml: 1,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  copyToClipboardAndNotify(item[1]);
                }}
              />
            </span>
          </div>
        );
      })}
    </Container>
  );
};

export default UrlParamsExtractor;

UrlParamsExtractor.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'URL Params Extractor',
        description: 'Extract URL params from a URL',
      },
    },
  };
};
