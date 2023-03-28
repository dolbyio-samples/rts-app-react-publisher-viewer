import { HStack, useDisclosure, VisuallyHidden } from '@chakra-ui/react';
import React, { FormEvent, useEffect, useState } from 'react';

import DeviceSelectionModal from '@millicast-react/device-selection-modal';
import { IconAddCamera, IconPresent, IconStreamLocal } from '@millicast-react/dolbyio-icons';
import LiveIndicator from '@millicast-react/live-indicator';
import LocalFileSelectionModal from '@millicast-react/local-file-selection-modal';
import PopupMenu from '@millicast-react/popup-menu';
import ShareLinkButton from '@millicast-react/share-link-button';

import useCanCaptureStream from '../../hooks/use-can-capture-stream';

import { ActionBarProps } from './types';

const ActionBar = ({
  audioDevices,
  onAddLocalFile: handleAddLocalFile,
  onStartAllSources: handleStartAllSources,
  onStartMediaDevice: handleStartMediaDevice,
  onStartScreenShare: handleStartScreenShare,
  onStopAllSources: handleStopAllSources,
  maxSources = 4,
  shareUrl,
  sources,
  streams,
  videoDevices,
}: ActionBarProps) => {
  const {
    isOpen: isDeviceSelectionOpen,
    onOpen: handleOpenDeviceSelection,
    onClose: handleCloseDeviceSelection,
  } = useDisclosure();

  const {
    isOpen: isFileSelectModalOpen,
    onOpen: onFileSelectModalOpen,
    onClose: onFileSelectModalClose,
  } = useDisclosure();

  const [newCamera, setNewCamera] = useState<InputDeviceInfo>();
  const [newMicrophone, setNewMicrophone] = useState<InputDeviceInfo>();

  const canCaptureStream = useCanCaptureStream();

  // Update default device selection values
  useEffect(() => {
    if (isDeviceSelectionOpen && videoDevices.length > 0 && audioDevices.length > 0) {
      setNewCamera(videoDevices[0]);
      setNewMicrophone(audioDevices[0]);
    }
  }, [isDeviceSelectionOpen, videoDevices, audioDevices]);

  const addNewDevice = async () => {
    if (!newCamera || !newMicrophone) {
      return;
    }

    if (sources.size < maxSources) {
      handleStartMediaDevice({ audioDeviceId: newMicrophone.deviceId, videoDeviceId: newCamera.deviceId });

      handleCloseDeviceSelection();

      setNewCamera(undefined);
      setNewMicrophone(undefined);
    }
  };

  const handleStartDisplayCapture = async () => {
    if (sources.size < maxSources) {
      handleStartScreenShare();
    }
  };

  const handleSubmitLocalFile = (event: FormEvent) => {
    event.preventDefault();

    const data = new FormData(event.target as HTMLFormElement);

    const { file } = Object.fromEntries(data.entries());

    if (file && file instanceof File) {
      handleAddLocalFile(file);
    }

    onFileSelectModalClose();
  };

  const isPublisherConnecting = Array.from(sources).some(([, { state }]) => state === 'connecting');
  const isPublisherStreaming = Array.from(sources).some(([, { state }]) => state === 'streaming');

  return (
    <>
      <HStack
        alignItems="center"
        borderRadius="8px"
        justifyContent="space-between"
        padding="8px 24px"
        test-id="actionBar"
        width="100%"
      >
        <HStack>
          {shareUrl && <ShareLinkButton linkText={shareUrl} tooltip={{ placement: 'top' }} />}
          <VisuallyHidden test-id="hiddenViewerLink">{shareUrl}</VisuallyHidden>
        </HStack>
        <HStack gap="20px">
          <PopupMenu
            buttonTitle="Add Source"
            disabled={streams.size >= maxSources}
            items={[
              {
                icon: <IconPresent />,
                onClick: handleStartDisplayCapture,
                text: 'Share screen',
              },
              {
                icon: <IconAddCamera />,
                isDisabled: videoDevices.length === 0 || audioDevices.length === 0,
                onClick: handleOpenDeviceSelection,
                text: 'Add cameras',
              },
              // It is not possible to stream local files if HTMLMediaElement.captureStream is not available
              // e.g. on Safari https://caniuse.com/?search=captureStream
              ...(canCaptureStream
                ? [
                    {
                      icon: <IconStreamLocal />,
                      isDisabled: !canCaptureStream,
                      onClick: onFileSelectModalOpen,
                      text: 'Stream local file',
                    },
                  ]
                : []),
            ]}
          />
          <LiveIndicator
            disabled={!sources.size}
            isActive={isPublisherStreaming}
            isLoading={isPublisherConnecting}
            start={handleStartAllSources}
            stop={handleStopAllSources}
            testId={isPublisherStreaming ? 'stop-all-live-indicator' : 'start-all-live-indicator'}
          />
        </HStack>
      </HStack>
      <DeviceSelectionModal
        camera={newCamera}
        cameraList={videoDevices}
        isOpen={isDeviceSelectionOpen}
        microphone={newMicrophone}
        microphoneList={audioDevices}
        onClose={handleCloseDeviceSelection}
        onSelectCamera={setNewCamera}
        onSelectMicrophone={setNewMicrophone}
        onSubmit={addNewDevice}
      />
      <LocalFileSelectionModal
        isOpen={isFileSelectModalOpen}
        onClose={onFileSelectModalClose}
        onSubmit={handleSubmitLocalFile}
      />
    </>
  );
};

export default ActionBar;
