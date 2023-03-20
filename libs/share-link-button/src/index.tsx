import { Button, Tooltip, TooltipProps, useClipboard } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import { IconCopy } from '#millicast-react/dolbyio-icons';

export interface ShareLinkButtonProps {
  linkText: string;
  tooltip?: Omit<TooltipProps, 'children'>;
}

const ShareLinkButton = ({ tooltip, linkText }: ShareLinkButtonProps) => {
  const { hasCopied, setValue, onCopy } = useClipboard(linkText);
  useEffect(() => {
    setValue(linkText);
  }, [linkText]);
  return (
    <Tooltip closeDelay={3000} label={hasCopied ? 'Link copied!' : 'Copy link'} {...tooltip}>
      <Button
        aria-label="Copy link"
        fontSize="14px"
        leftIcon={<IconCopy height="24px" width="24px" />}
        onClick={onCopy}
        test-id="shareLinkButton"
        variant="link"
      >
        Invite viewers
      </Button>
    </Tooltip>
  );
};

export default ShareLinkButton;
