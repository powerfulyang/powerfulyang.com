import { PrismCode } from '@/components/PrismCode';
import { generateTableCode } from '@/services/swagger-parse';
import type { DocumentPath } from '@/services/swagger-parse/getDocumentPaths';
import { getDocumentPaths } from '@/services/swagger-parse/getDocumentPaths';
import { snippet } from '@/snippets/table';
import SwaggerParser from '@apidevtools/swagger-parser';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Container, Stack, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import type { OpenAPIV3 } from 'openapi-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';

type FormHookData = {
  path: DocumentPath | null;
};

const Swagger2code: LayoutFC = () => {
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
    onError(e: Error) {
      toast.error(e.message);
    },
  });

  const generateCode = useMutation({
    mutationFn: ({ path }: FormHookData) => {
      if (!loadSwagger.data || !path) {
        throw new Error('no swagger data');
      }
      const columns = generateTableCode(loadSwagger.data, path);
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
      <Container className="flex flex-col items-center space-y-4 p-10" maxWidth="sm">
        <Stack direction="row" spacing={2} alignItems="center" className="w-full">
          <TextField
            disabled={loadSwagger.isSuccess}
            label="swagger url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            className="flex-1"
          />
          <LoadingButton
            onClick={() => {
              loadSwagger.mutate(url);
            }}
            variant="contained"
            disabled={!url || loadSwagger.isSuccess}
            loading={loadSwagger.isLoading}
          >
            Load Swagger
          </LoadingButton>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center" className="w-full">
          <Controller
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                  className="flex-1"
                  options={getDocumentPaths(loadSwagger.data)}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={`${option.url} ${option.method}`}>
                        {option.method.toUpperCase()} {option.url}
                      </li>
                    );
                  }}
                  renderInput={(params) => {
                    return <TextField {...params} label="path" />;
                  }}
                  getOptionLabel={(option) => {
                    return `${option.method.toUpperCase()} ${option.url}`;
                  }}
                  isOptionEqualToValue={(option, value) => {
                    return option.url === value.url && option.method === value.method;
                  }}
                  disabled={!loadSwagger.isSuccess}
                  onChange={(_e, v) => {
                    field.onChange(v);
                  }}
                />
              );
            }}
            name="path"
          />
          <LoadingButton type="submit" variant="contained" disabled={!loadSwagger.isSuccess}>
            Generate Code
          </LoadingButton>
        </Stack>
      </Container>
      {generateCode.data && (
        <PrismCode
          language="typescript"
          maxHeight={400}
          className="m-auto w-[90%] max-w-[800px] leading-8"
        >
          {generateCode.data}
        </PrismCode>
      )}
    </form>
  );
};

Swagger2code.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
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
