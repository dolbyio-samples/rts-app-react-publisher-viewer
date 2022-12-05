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
import useMultiMediaDevices, {
  Stream,
  StreamId,
  StreamTypes,
  Resolution,
} from '@millicast-react/use-multi-media-devices';
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
      <VideoView width="300px" height="168px" mediaStream={stream.display} />
      <ControlBar
        controls={[
          {
            key: 'removeStreamButton',
            'test-id': 'removeStreamButton',
            tooltip: { label: 'Remove stream', placement: 'top' },
            onClick: removeStream,
            icon: <IconClose />,
          },
          {
            key: 'toggleMicrophoneButton',
            'test-id': 'toggleMicrophoneButton',
            tooltip: { label: 'Toggle microphone', placement: 'top' },
            onClick: toggleAudio,
            isActive: !state.muteAudio,
            icon: state.muteAudio ? <IconMicrophoneOn /> : <IconMicrophoneOff />,
          },
          {
            key: 'toggleCameraButton',
            'test-id': 'toggleCameraButton',
            tooltip: { label: 'Toggle camera', placement: 'top' },
            onClick: toggleVideo,
            isActive: !state.displayVideo,
            icon: state.displayVideo ? <IconCameraOn /> : <IconCameraOff />,
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
  } = useMultiMediaDevices();

  const addCustomStream = async () => {
    await addStream({ type: StreamTypes.MEDIA, microphone, camera });
    onClose();
    setCamera(null);
    setMicrophone(null);
  };

  const updateResolution = async (id: StreamId, resolution: Resolution) => {
    await applyConstraints({ id, videoConstraints: { width: resolution.width, height: resolution.height } });
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
