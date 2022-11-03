import React, { useState, memo } from 'react';
import { Select } from '@chakra-ui/react';

type ResolutionSelectProps = {
    updateResolution: (resolution: Resolution) => void;
};

export type Resolution = {
    width: number;
    height: number;
}

export type Resolutions = "2160p" | "1080p" | "720p" | "480p";

const ResolutionSelect = ({ updateResolution }: ResolutionSelectProps) => {

    const [resolution, setResolution] = useState<Resolutions>("720p");

    const onResolutionChange = (selectedResolution: Resolutions) => {
        // All resolutions follow 16:9 aspect ratio
        switch (selectedResolution) {
            case "1080p":
                updateResolution({ width: 1920, height: 1080 });
                break;
            case "720p":
                updateResolution({ width: 1280, height: 720 });
                break;
            case "480p":
                updateResolution({ width: 720, height: 480 });
                break;
            case "2160p":
                updateResolution({ width: 3840, height: 2160 });
                break;
        }
        setResolution(selectedResolution);
    };


    return (
        <Select
            test-id="resolutionSelect"
            placeholder='Select Resolution'
            defaultValue={resolution}
            onChange={(event) => onResolutionChange(event.target.value as Resolutions)}>
            <option value="2160p">2160p</option>
            <option value="1080p">1080p</option>
            <option value="720p">720p</option>
            <option value="480p">480p</option>
        </Select>
    );
};

export default memo(ResolutionSelect);