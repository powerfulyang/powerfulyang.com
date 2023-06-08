import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { ArtTypeEnum, ImageAscii } from 'image-ascii-art';
import { useRef } from 'react';
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
      const _image = values.images?.item(0);
      if (!_image) {
        throw new Error('请选择文件');
      }
      const image = new Image();
      image.src = URL.createObjectURL(_image);
      return new Promise<HTMLImageElement>((resolve, reject) => {
        image.onload = () => {
          resolve(image);
        };
        image.onerror = (e) => {
          reject(e);
        };
      });
    },
  });

  const ref = useRef<HTMLDivElement>(null);

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
          <div
            ref={ref}
            className="m-auto mt-8"
            style={{
              width: 'fit-content',
            }}
          >
            {convertImage.data && (
              <ImageAscii
                parentRef={ref}
                image={convertImage.data}
                artType={ArtTypeEnum.ASCII_COLOR_BG_IMAGE}
                fontColor="white"
                backgroundColor="black"
                charsPerLine={convertImage.data.width}
                charsPerColumn={convertImage.data.height}
              />
            )}
          </div>
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
