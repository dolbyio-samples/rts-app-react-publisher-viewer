import { Center, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import IconParticipant from "../Icons/Participants";

export type ParticipantCountProps = {
    count: string | number;
}
const ParticipantCount = ({ count }: ParticipantCountProps) => {
    const purple400 = "var(--chakra-colors-dolbyPurple-400)";
    return (
        <Flex h={10} bg={purple400} me={2} test-id="participantCountView">
            <Center>
                <IconParticipant />
                <Text fontSize='2xl' m={2}> {count} </Text>
            </Center>
        </Flex>
    );
};


export default ParticipantCount;