import { PrismCode } from '@/components/PrismCode';
import { clientApi } from '@/request/requestTool';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

type FormProps = {
  images: FileList | null;
};

const Image2ASCII = () => {
  const { control, setValue, handleSubmit } = useForm<FormProps>({
    defaultValues: {},
    resolver: zodResolver(
      z.object({
        images: z.custom(
          (v) => {
            const images = Array.from(v as FileList);
            return images.every((file) => file instanceof File);
          },
          {
            message: '请选择文件',
          },
        ),
      }),
    ),
  });

  const convertImage = useMutation({
    mutationFn: (values: Required<FormProps>) => {
      return clientApi
        .toolsControllerImage2Ascii(
          {
            images: Array.from(values.images!),
          },
          {
            format: 'text',
          },
        )
        .then((res) => res.data);
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center">
        <p className="mt-10 w-full text-center text-[40px] font-medium text-[#212529]">
          Image to ASCII
        </p>
        <p className="mt-4 text-center text-sm text-[#1b233d]/70">
          Easily convert your images to ASCII.
        </p>
      </div>
      <div className="mt-4 text-center">
        <form
          onSubmit={handleSubmit((v) => {
            convertImage.mutate(v as Required<FormProps>);
          })}
        >
          <Controller
            render={({ fieldState, field }) => {
              return (
                <div>
                  <Button
                    sx={{
                      minWidth: 240,
                      my: 1,
                    }}
                    variant="contained"
                    component="label"
                  >
                    选择文件
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        setValue('images', e.target.files);
                      }}
                    />
                  </Button>
                  {fieldState.error?.message && (
                    <Typography variant="body1" color="error">
                      {fieldState.error?.message}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      m: 'auto',
                      maxWidth: 240,
                    }}
                    className="truncate"
                    variant="body1"
                    title={field.value?.item(0)?.name}
                  >
                    {field.value?.item(0)?.name}
                  </Typography>
                </div>
              );
            }}
            name="images"
            control={control}
          />
          <br />
          <LoadingButton
            variant="contained"
            type="submit"
            sx={{
              minWidth: 240,
            }}
            loading={convertImage.isLoading}
          >
            Convert
          </LoadingButton>
          <br />
          <br />
          {convertImage.data && (
            <PrismCode
              maxHeight={400}
              className="m-auto w-[90%] max-w-[1000px] leading-8"
              language="text"
            >
              {convertImage.data}
            </PrismCode>
          )}
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Image to ASCII',
        description: 'Image to ASCII',
      },
    },
  };
};

export default Image2ASCII;
