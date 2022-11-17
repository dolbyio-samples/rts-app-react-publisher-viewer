import { Box, Button, Text, Tooltip, TooltipProps, useClipboard } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { IconCopy } from '@millicast-react/dolbyio-icons';

export type ShareLinkButtonProps = {
  tooltip?: Omit<TooltipProps, 'children'>;
  linkText: string;
};

const ShareLinkButton = ({ tooltip, linkText }: ShareLinkButtonProps) => {
  const { hasCopied, setValue, onCopy } = useClipboard(linkText);
  useEffect(() => {
    setValue(linkText);
  }, [linkText]);
  return (
    <Box>
      <Text fontSize="18px" fontWeight="600">
        Invite viewers
      </Text>
      <Tooltip label={hasCopied ? 'Link copied!' : 'Copy link'} {...tooltip}>
        <Button
          onClick={onCopy}
          leftIcon={<IconCopy height="21px" />}
          size="sm"
          aria-label="Copy link"
          test-id="shareLinkButton"
          variant="transparent"
        >
          {linkText}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default ShareLinkButton;
