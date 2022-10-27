import React, { memo } from "react";
import {
    HStack,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Select,
    Spacer,
    Switch,
    Text,
    VStack,
} from "@chakra-ui/react";
import IconSettings from '../Icons/Settings';
import MediaDeviceSelect from "../MediaDeviceSelect/MediaDeviceSelect";

import type { PublisherState } from '../../hooks/usePublisher';

type DevicesPopoverProps = {
    publisherState: PublisherState;
    cameraList: InputDeviceInfo[];
    cameraId?: string;
    onSelectCameraId: (deviceId: string) => void;
    microphoneList: InputDeviceInfo[];
    microphoneId?: string
    onSelectMicrophoneId: (deviceId: string) => void;
    codecList: string[];
    codec: string;
    updateCodec: (codec: string) => void;
    setIsSimulcastEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    isSimulcastEnabled: boolean;
}

const DevicesPopover = ({
    publisherState,
    cameraList,
    cameraId,
    onSelectCameraId,
    microphoneList,
    microphoneId,
    onSelectMicrophoneId,
    codecList,
    codec,
    updateCodec,
    setIsSimulcastEnabled,
    isSimulcastEnabled
}: DevicesPopoverProps) => {
    const purple400 = "var(--chakra-colors-dolbyPurple-400)";

    return (
        <Popover placement="bottom">
            <PopoverTrigger>
                <IconButton
                size='lg'
                p='4px'
                aria-label="settings"
                variant="outline"
                test-id='settingsButton'
                icon={<IconSettings fill={purple400} />}
                />
            </PopoverTrigger>
            <PopoverContent minWidth='360'>
                <PopoverHeader pt={4} fontWeight='bold' border='0'>
                Manage Your Devices
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                <VStack>
                    <HStack width='100%'>
                    <Text> Camera: </Text>
                    <Spacer />
                    { cameraList.length && (
                        <MediaDeviceSelect
                        disabled = { publisherState === 'connecting' }
                        testId="camera-select"
                        placeHolder="Select Camera"
                        selectedDeviceId={cameraId}
                        deviceList={cameraList}
                        onSelectDeviceId={onSelectCameraId}
                        />
                    )}
                    </HStack>
                    <HStack width='100%'>
                    <Text> Microphone: </Text>
                    <Spacer />
                    { microphoneList.length && (
                        <MediaDeviceSelect
                        disabled = { publisherState === 'connecting' }
                        testId="microphone-select"
                        placeHolder="Select Microphone"
                        selectedDeviceId={microphoneId}
                        deviceList={microphoneList}
                        onSelectDeviceId={onSelectMicrophoneId}
                        />
                    )}
                    </HStack>
                    <HStack width='100%'>
                    <Text> Codec </Text>
                    {
                        <Select
                        disabled={publisherState !== "ready" || codecList.length === 0}
                        test-id="codecSelect"
                        placeholder="Select Codec"
                        defaultValue={codec || (codecList.length !== 0 ? codecList[0] : undefined)}
                        onChange={(e) => updateCodec(e.target.value)}
                        >
                        {codecList.map((codec: string) => {
                            return (
                            <option value={codec} key={codec}>
                                {codec}
                            </option>
                            );
                        })}
                        </Select>
                    }
                    </HStack>
                    <Switch test-id="simulcastSwitch"
                    onChange={() => setIsSimulcastEnabled(!isSimulcastEnabled)}
                    disabled={publisherState !== "ready"}
                    >
                    Simulcast
                    </Switch>
                </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

const areEqual = (prevProps: DevicesPopoverProps, nextProps: DevicesPopoverProps) => {
    return prevProps.cameraId === nextProps.cameraId && prevProps.microphoneId === nextProps.microphoneId
}

export default memo(DevicesPopover, areEqual);