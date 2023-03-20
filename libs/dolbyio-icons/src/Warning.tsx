import React, { SVGProps } from 'react';

const SvgWarning = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill={props.fill || 'currentColor'}
    height="100%"
    viewBox="0 0 24 24"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      clipRule="evenodd"
      d="M23 12c0-6.072-4.928-11-11-11S1 5.928 1 12s4.928 11 11 11 11-4.928 11-11ZM3 12c0-4.967 4.033-9 9-9s9 4.033 9 9-4.033 9-9 9-9-4.033-9-9Zm9-6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Zm1 11a1 1 0 1 1-1-1 1 1 0 0 1 1 1Z"
      fill={props.fill || 'currentColor'}
      fillRule="evenodd"
    />
  </svg>
);

export default SvgWarning;
