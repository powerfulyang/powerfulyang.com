import { PrismCode } from '@/components/Code';
import { generateTableFromPath, swaggerPaths } from '@/services/swagger-parse';
import { snippet } from '@/snippets/table';
import SwaggerParser from '@apidevtools/swagger-parser';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Stack, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import type { OpenAPIV3 } from 'openapi-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type FormHookData = {
  path: string | null;
};

const Swagger2code = () => {
  const [url, setUrl] = React.useState<string>('');
  const { control, handleSubmit } = useForm<FormHookData>({
    defaultValues: {
      path: null,
    },
  });

  const loadSwagger = useMutation({
    mutationFn: async (_url: string) => {
      return (await SwaggerParser.parse(_url)) as OpenAPIV3.Document;
    },
  });

  const generateCode = useMutation({
    mutationFn: ({ path }: FormHookData) => {
      if (!loadSwagger.data || !path) {
        throw new Error('no swagger data');
      }
      const [_method, _path] = path.split(' ');
      const columns = generateTableFromPath(loadSwagger.data, _path, _method.toLowerCase());
      const _snippet = snippet({
        COLUMNS: JSON.stringify(columns, null, 2),
      });
      return Promise.resolve(_snippet);
    },
    onError(e: Error) {
      toast.error(e.message);
    },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => {
        generateCode.mutate(v);
      })}
    >
      <div className="flex flex-col items-center space-y-4 p-12">
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="swagger url"
            sx={{
              width: '400px',
            }}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
          <LoadingButton
            onClick={() => {
              loadSwagger.mutate(url);
            }}
            variant="contained"
            disabled={!url}
            loading={loadSwagger.isLoading}
          >
            Load Swagger
          </LoadingButton>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Controller
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                  options={swaggerPaths(loadSwagger.data).map((path) => path)}
                  renderInput={(params) => <TextField {...params} label="Select Path" />}
                  getOptionLabel={(option) => option}
                  sx={{
                    width: '400px',
                  }}
                  disabled={!loadSwagger.data}
                  {...field}
                  onChange={(_e, v) => {
                    field.onChange(v);
                  }}
                />
              );
            }}
            name="path"
          />
          <LoadingButton type="submit" variant="contained">
            Generate Code
          </LoadingButton>
        </Stack>

        {generateCode.data && (
          <PrismCode language="typescript" maxHeight={500} className="min-w-[800px]">
            {generateCode.data}
          </PrismCode>
        )}
      </div>
    </form>
  );
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'swagger2code',
        description: 'convert swagger to typescript code, such as antd',
      },
    },
  };
};

export default Swagger2code;
