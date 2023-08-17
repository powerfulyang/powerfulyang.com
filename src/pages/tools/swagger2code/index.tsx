import SwaggerParser from '@apidevtools/swagger-parser';
import { useMutation } from '@tanstack/react-query';
import type { OpenAPIV3 } from 'openapi-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { LoadingButton } from '@/components/utils/LoadingButton';
import { Input } from '@/components/ui/input';
import { snippet } from '@/snippets/table';
import type { DocumentPath } from '@/services/swagger-parse/getDocumentPaths';
import { PrismCode } from '@/components/PrismCode';
import type { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { generateTableCode } from '@/services/swagger-parse/generateTableCode';

type FormHookData = {
  path:
    | (DocumentPath & {
        fieldPath?: string | string[];
      })
    | null;
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
      const schema = Reflect.getMetadata('$ref', columns);
      const operationId = Reflect.getMetadata('operationId', columns);
      const description = Reflect.getMetadata('description', columns);
      const tag = Reflect.getMetadata('tag', columns);
      const _snippet = snippet({
        COLUMNS: JSON.stringify(columns, null, 2),
        SCHEMA: schema,
        operationId,
        description,
        tag,
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
      <div className="flex flex-col items-center space-y-4 p-10">
        <h3 className="text-3xl font-medium">Swagger to Code</h3>
        <p className="mb-8 text-center text-sm text-[#1b233d]/70">
          Generate code from swagger document, such as ProTable, ProForm(not implemented yet) etc.
        </p>
        <div className="flex w-full items-center justify-center gap-2">
          <Input
            disabled={loadSwagger.isSuccess}
            placeholder="swagger url"
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
            disabled={!url || loadSwagger.isSuccess}
            loading={loadSwagger.isLoading}
          >
            Load Swagger
          </LoadingButton>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <Controller
            control={control}
            render={({ field }) => {
              return <Input value={field.value?.fieldPath} />;
            }}
            name="path"
          />
          <Controller
            render={({ field }) => {
              return (
                <Input
                  className="flex-grow-[1]"
                  disabled={!loadSwagger.isSuccess}
                  placeholder="e.g. data,list, data,total"
                  {...field}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value) {
                      field.onChange(value.split(','));
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                />
              );
            }}
            control={control}
            name="path.fieldPath"
          />
          <LoadingButton
            className="flex-1 whitespace-pre"
            loading={generateCode.isLoading}
            type="submit"
            disabled={!loadSwagger.isSuccess}
          >
            Generate Code
          </LoadingButton>
        </div>
      </div>
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
        description:
          'Generate code from swagger document, such as ProTable, ProForm(not implemented yet) etc.',
      },
    },
  };
};

export default Swagger2code;
