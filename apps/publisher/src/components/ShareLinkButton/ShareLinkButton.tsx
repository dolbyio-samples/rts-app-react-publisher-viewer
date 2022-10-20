import React from "react";
import { Button, useClipboard } from "@chakra-ui/react";

export type ShareLinkButtonProps = {
    linkText: string
}

const ShareLinkButton = ({ linkText }: ShareLinkButtonProps) => {

    const { hasCopied, onCopy } = useClipboard(linkText);
    return (
        <Button
            onClick={onCopy}
            ml={2}
            minW="40"
            size="md"
            aria-label="Copy link"
            test-id="shareLinkButton">
            {hasCopied ? 'Copied!' : 'Copy link'}
        </Button >
    );
};

export default ShareLinkButton;