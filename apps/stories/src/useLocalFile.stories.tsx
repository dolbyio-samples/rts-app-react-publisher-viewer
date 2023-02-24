import { ChakraProvider, Stack, Box, Button } from '@chakra-ui/react';
import { Meta, Story } from '@storybook/react';
import React, { useState } from 'react';

import dolbyioTheme from '@millicast-react/dolbyio-theme';
import useLocalFile from '@millicast-react/use-local-file';
import { HTMLVideoElementWithCaptureStream } from '@millicast-react/use-multi-media-devices';
import VideoView from '@millicast-react/video-view';

export default {} as Meta;

export const Default: Story = () => {
  const { localFile, register } = useLocalFile();

  const [mediaStream, setMediaStream] = useState<MediaStream>();

  const addFileSource = async () => {
    const video = document.createElement('video') as HTMLVideoElementWithCaptureStream;
    video.loop = true;
    video.src = localFile.objectUrl;

    const newMediaStream = video.captureStream();

    await video.play();

    setMediaStream(newMediaStream);
  };

  return (
    <ChakraProvider theme={dolbyioTheme}>
      <Box mb={2}>
        <Box>
          <input id="uploadFile" {...register()} />
        </Box>
        <Button onClick={addFileSource}>ADD STREAMING FILE</Button>
      </Box>
      <Stack direction="row" flexWrap="wrap">
        {localFile && mediaStream ? (
          <Stack key={localFile.name}>
            <VideoView height="auto" mediaStream={mediaStream} width="800px" />
          </Stack>
        ) : undefined}
      </Stack>
    </ChakraProvider>
  );
};
