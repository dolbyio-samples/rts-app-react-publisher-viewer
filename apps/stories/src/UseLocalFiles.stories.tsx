import { Meta, Story } from '@storybook/react';
import { Button, ChakraProvider, Stack, Box, FormLabel } from '@chakra-ui/react';
import dolbyioTheme from '@millicast-react/dolbyio-theme';
import * as React from 'react';
import useLocalFiles from '@millicast-react/use-local-files';
import VideoView from '@millicast-react/video-view';

export default {} as Meta;

export const Default: Story = () => {
  const { register, files, remove, reset } = useLocalFiles();
  return (
    <ChakraProvider theme={dolbyioTheme}>
      <Box mb={2}>
        <Box>
          <FormLabel htmlFor="uploadFile" cursor="pointer" textTransform="uppercase">
            upload
          </FormLabel>
          <input id="uploadFile" hidden {...register({ name: 'file' })} />
        </Box>
        {files.length > 0 && <Button onClick={reset}>reset</Button>}
      </Box>
      <Stack direction="row" flexWrap="wrap">
        {files.map((file) => (
          <Stack key={file}>
            <VideoView url={file} width="400px" height="auto" />
            <Box>
              <Button onClick={() => remove(file)}>remove</Button>
            </Box>
          </Stack>
        ))}
      </Stack>
    </ChakraProvider>
  );
};
