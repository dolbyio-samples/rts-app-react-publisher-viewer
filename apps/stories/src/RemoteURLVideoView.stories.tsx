import { Meta, Story } from '@storybook/react';
import { ChakraProvider, VStack, Text } from '@chakra-ui/react';
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

  // To make this video view work without CORS issue, please install (local-cors-proxy) https://www.npmjs.com/package/local-cors-proxy
  // And run `lcp --proxyUrl https://streaming.dolby.io/media` from your terminal
  // TODO: remove local-cors-proxy when we deploy the storybook to server
  return (
    <>
      <ChakraProvider theme={dolbyioTheme}>
        <VStack>
          <VideoView
            src="http://localhost:8010/proxy/lipsynctest.333c28e3.mp4"
            width="400px"
            height="auto"
            onSrcMediaStreamReady={setMediaStream}
            onSrcMediaStreamClose={removeMediaStream}
            onError={(e) => console.log(e)}
          />
          {mediaStreams.map((stream) => (
            <Text key={stream.id} color="black">
              Video track id: {stream.getVideoTracks()[0].id} in MediaStream from VideoView
            </Text>
          ))}
        </VStack>
      </ChakraProvider>
    </>
  );
};
