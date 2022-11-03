import { Button, useClipboard } from '@chakra-ui/react';
import React, { useEffect } from 'react';

export type ShareLinkButtonProps = {
  linkText: string;
};

const ShareLinkButton = ({ linkText }: ShareLinkButtonProps) => {
  const { hasCopied, setValue, onCopy } = useClipboard(linkText);
  useEffect(() => {
    setValue(linkText);
  }, [linkText]);
  return (
    <>
      <Button onClick={() => onCopy()} ml={2} minW="40" size="md" aria-label="Copy link" test-id="shareLinkButton">
        {hasCopied ? 'Copied!' : 'Copy link'}
      </Button>
    </>
  );
};

export default ShareLinkButton;
