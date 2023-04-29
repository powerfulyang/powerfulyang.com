import { convertSchemaToCode } from '@/services/swagger-parse';
import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormData = {
  url: string;
  entity: string;
};

const Swagger2code = () => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      url: '',
    },
  });

  const loadSwagger = useMutation({
    mutationFn: async ({ url, entity }: FormData) => {
      return convertSchemaToCode(url, entity);
    },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => {
        loadSwagger.mutate(v);
      })}
    >
      <div className="m-8 flex flex-col items-center space-y-4">
        <Controller
          control={control}
          render={({ field }) => {
            return (
              <TextField
                label="swagger url"
                sx={{
                  width: '400px',
                }}
                {...field}
              />
            );
          }}
          name="url"
        />
        <Controller
          control={control}
          render={({ field }) => {
            return (
              <TextField
                label="entity"
                sx={{
                  width: '400px',
                }}
                {...field}
              />
            );
          }}
          name="entity"
        />
        <br />
        <LoadingButton type="submit" variant="contained">
          Generate Code
        </LoadingButton>
        <pre>{JSON.stringify(loadSwagger.data, null, 2)}</pre>
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
