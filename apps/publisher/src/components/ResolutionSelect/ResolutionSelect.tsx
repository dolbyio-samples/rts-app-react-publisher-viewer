import React, { useState } from 'react';
import { Select } from '@chakra-ui/react';

type ResolutionSelectProps = {
    updateResolution: (resolution: Resolution) => void;
};

export type Resolution = {
    width: number;
    height: number;
}

type Resolutions = "1080p" | "720p" | "480p" | "360p";

const ResolutionSelect = ({ updateResolution }: ResolutionSelectProps) => {

    const [resolution, setResolution] = useState<Resolutions>("720p");

    const onResolutionChange = (selectedResolution: Resolutions) => {
        // All resolutions follow 16:9 aspect ratio
        switch (selectedResolution) {
            case "1080p":
                updateResolution({ width: 1920, height: 1080 });
                break;
            case "720p":
                updateResolution({ width: 1920, height: 1080 });
                break;
            case "480p":
                updateResolution({ width: 854, height: 480 });
                break;
            case "360p":
                updateResolution({ width: 640, height: 360 });
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
            <option value="1080p">1080p</option>
            <option value="720p">720p</option>
            <option value="480p">480p</option>
            <option value="360p">360p</option>
        </Select>
    );
};

export default ResolutionSelect;