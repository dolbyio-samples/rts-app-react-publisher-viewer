import { Meta, Story } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import dolbyioTheme from '@millicast-react/dolbyio-theme';
import * as React from 'react';
import VideoView from '@millicast-react/video-view';
import { useState } from 'react';

export default {} as Meta;

export const Default: Story = () => {
  const [mediaStreams, setMediaStreams] = useState<MediaStream[]>([]);

  const setMediaStream = (stream: MediaStream) => {
    setMediaStreams((prev) => [...prev, stream]);
  };

  const removeMediaStream = (id: string) => {
    setMediaStreams((prev) => prev.filter((stream) => stream.id !== id));
  };
  return (
    <ChakraProvider theme={dolbyioTheme}>
      <VideoView
        src="https://streaming.dolby.io/media/lipsynctest.333c28e3.mp4"
        width="400px"
        height="auto"
        onSrcMediaStreamReady={setMediaStream}
        onSrcMediaStreamClose={removeMediaStream}
        onError={(e) => console.log(e)}
      />
    </ChakraProvider>
  );
};
