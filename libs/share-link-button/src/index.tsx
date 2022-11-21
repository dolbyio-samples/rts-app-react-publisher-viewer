import { Button, Tooltip, TooltipProps, useClipboard } from '@chakra-ui/react';
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
    <Tooltip closeDelay={3000} label={hasCopied ? 'Link copied!' : 'Copy link'} {...tooltip}>
      <Button
        onClick={onCopy}
        leftIcon={<IconCopy height="24px" width="24px" />}
        aria-label="Copy link"
        test-id="shareLinkButton"
        variant="link"
        fontSize="14px"
      >
        Invite viewers
      </Button>
    </Tooltip>
  );
};

export default ShareLinkButton;
