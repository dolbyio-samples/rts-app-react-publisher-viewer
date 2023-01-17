import { Meta, Story } from '@storybook/react';
import { ChakraProvider, Stack, Box } from '@chakra-ui/react';
import dolbyioTheme from '@millicast-react/dolbyio-theme';
import * as React from 'react';
import useLocalFile from '@millicast-react/use-local-file';
import VideoView from '@millicast-react/video-view';
import { useState } from 'react';

export default {} as Meta;

export const Default: Story = () => {
  const [, setMediaStreams] = useState<MediaStream[]>([]);
  const { register, file } = useLocalFile();

  const setMediaStream = (stream: MediaStream) => {
    setMediaStreams((prev) => [...prev, stream]);
  };

  const removeMediaStream = (id: string) => {
    setMediaStreams((prev) => prev.filter((stream) => stream.id !== id));
  };

  return (
    <ChakraProvider theme={dolbyioTheme}>
      <Box mb={2}>
        <Box>
          <input id="uploadFile" {...register()} />
        </Box>
      </Box>
      <Stack direction="row" flexWrap="wrap">
        {file ? (
          <Stack key={file}>
            <VideoView
              src={file}
              width="800px"
              height="auto"
              onSrcMediaStreamReady={setMediaStream}
              onSrcMediaStreamClose={removeMediaStream}
              onError={(e) => console.log(e)}
            />
          </Stack>
        ) : undefined}
      </Stack>
    </ChakraProvider>
  );
};
