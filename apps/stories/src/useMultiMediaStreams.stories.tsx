import { Meta, Story } from '@storybook/react';
import {
  Box,
  Button,
  ChakraProvider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import VideoView from '@millicast-react/video-view';
import useMultiMediaStreams, { Stream, StreamTypes, Resolution } from '@millicast-react/use-multi-media-streams';
import dolbyioTheme from '@millicast-react/dolbyio-theme';
import ControlBar from '@millicast-react/control-bar';
import Dropdown from '@millicast-react/dropdown';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  IconMicrophoneOn,
  IconMicrophoneOff,
  IconCameraOn,
  IconCameraOff,
  IconClose,
  IconResolution,
} from '@millicast-react/dolbyio-icons';

export default {} as Meta;

type StreamWrapperProps = {
  stream: Stream;
  removeStream: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  updateResolution: (resolution: Resolution) => void;
};

const StreamWrapper = ({ stream, removeStream, toggleAudio, toggleVideo, updateResolution }: StreamWrapperProps) => {
  const { state, resolutions, settings } = stream;
  return (
    <Stack>
      <VideoView width="300px" height="168px" mediaStream={stream.mediaStream} />
      <ControlBar
        controls={[
          {
            icon: <IconClose />,
            key: 'removeStreamButton',
            onClick: removeStream,
            testId: 'removeStreamButton',
            tooltipProps: { label: 'Remove stream', placement: 'top' },
          },
          settings
            ? {
                icon: state.muteAudio ? <IconMicrophoneOn /> : <IconMicrophoneOff />,
                isActive: !state.muteAudio,
                key: 'toggleMicrophoneButton',
                onClick: toggleAudio,
                testId: 'toggleMicrophoneButton',
                tooltipProps: { label: 'Toggle microphone', placement: 'top' },
              }
            : null,
          {
            icon: state.displayVideo ? <IconCameraOn /> : <IconCameraOff />,
            isActive: !state.displayVideo,
            key: 'toggleCameraButton',
            onClick: toggleVideo,
            testId: 'toggleCameraButton',
            tooltipProps: { label: 'Toggle camera', placement: 'top' },
          },
        ]}
      />
      <Box>
        {resolutions?.length && settings?.camera && (
          <Box>
            <Dropdown
              leftIcon={<IconResolution />}
              testId="resolutionSelect"
              elementsList={resolutions}
              elementResolver={(element) => {
                const resolution = element as Resolution;
                return {
                  id: `${resolution.width}x${resolution.height}`,
                  label: `${resolution.width}x${resolution.height}`,
                  data: resolution,
                };
              }}
              onSelect={(data) => updateResolution(data as Resolution)}
              selected={`${settings.camera.width}x${settings.camera.height}`}
              placeholder="Resolution"
            />
          </Box>
        )}
      </Box>
    </Stack>
  );
};

const Content = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [camera, setCamera] = useState<InputDeviceInfo | null>(null);
  const [microphone, setMicrophone] = useState<InputDeviceInfo | null>(null);
  const {
    initDefaultStream,
    streams,
    reset,
    removeStream,
    toggleAudio,
    toggleVideo,
    addStream,
    cameraList,
    microphoneList,
    applyConstraints,
  } = useMultiMediaStreams();

  const addCustomStream = async () => {
    await addStream({ type: StreamTypes.MEDIA, microphone, camera });
    onClose();
    setCamera(null);
    setMicrophone(null);
  };

  const updateResolution = async (id: string, resolution: Resolution) => {
    await applyConstraints(id, { videoConstraints: { height: resolution.height, width: resolution.width } });
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <Box bg="background" minH="1000px">
      <Stack direction="row" mb={2}>
        <Button size="sm" onClick={initDefaultStream}>
          Init default stream
        </Button>
        <Button size="sm" onClick={async () => await addStream({ type: StreamTypes.DISPLAY })}>
          Add display stream
        </Button>
        <Button size="sm" onClick={onOpen}>
          Add stream
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Select source</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack direction="column" spacing={4}>
                <Box>
                  <Dropdown
                    leftIcon={<IconCameraOn />}
                    testId="camera-select"
                    elementsList={cameraList}
                    elementResolver={(element) => {
                      const device = element as InputDeviceInfo;
                      return {
                        id: device.deviceId,
                        label: device.label,
                        data: device,
                      };
                    }}
                    onSelect={(data) => {
                      setCamera(data as InputDeviceInfo);
                    }}
                    selected={camera?.label}
                    placeholder="Camera"
                  />
                </Box>
                <Box>
                  <Dropdown
                    leftIcon={<IconMicrophoneOn />}
                    testId="microphone-select"
                    elementsList={microphoneList}
                    elementResolver={(element) => {
                      const device = element as InputDeviceInfo;
                      return {
                        id: device.deviceId,
                        label: device.label,
                        data: device,
                      };
                    }}
                    onSelect={(data) => {
                      setMicrophone(data as InputDeviceInfo);
                    }}
                    selected={microphone?.label}
                    placeholder="Microphone"
                  />
                </Box>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                isDisabled={camera === null || microphone === null}
                onClick={async () => await addCustomStream()}
              >
                Add
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Stack>
      <Stack direction="row" flexWrap="wrap">
        {[...streams].map(([id, stream]) => (
          <Box key={id} mb="2">
            <StreamWrapper
              stream={stream}
              removeStream={() => removeStream(id)}
              toggleAudio={() => toggleAudio(id)}
              toggleVideo={() => toggleVideo(id)}
              updateResolution={(resolution: Resolution) => updateResolution(id, resolution)}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export const Default: Story = () => (
  <ChakraProvider theme={dolbyioTheme}>
    <Content />
  </ChakraProvider>
);
