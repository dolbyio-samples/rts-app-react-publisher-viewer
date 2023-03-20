import React, { SVGProps } from 'react';

const SvgStreamRemote = ({ fill, ...props }: SVGProps<SVGSVGElement>) => (
  <svg fill="none" height="100%" viewBox="0 0 24 24" width="100%" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M11 17a1 1 0 0 0 1-1V6a1 1 0 1 0-2 0v10a1 1 0 0 0 1 1ZM9 13a1 1 0 1 1-2 0V9a1 1 0 1 1 2 0v4ZM14 14a1 1 0 0 0 1-1V9a1 1 0 1 0-2 0v4a1 1 0 0 0 1 1Z"
      fill={fill || 'currentColor'}
    />
    <path
      d="M11 17a1 1 0 0 0 1-1V6a1 1 0 1 0-2 0v10a1 1 0 0 0 1 1ZM9 13a1 1 0 1 1-2 0V9a1 1 0 1 1 2 0v4ZM14 14a1 1 0 0 0 1-1V9a1 1 0 1 0-2 0v4a1 1 0 0 0 1 1Z"
      fill={fill || 'currentColor'}
    />
    <path
      clipRule="evenodd"
      d="M0 11C0 4.925 4.925 0 11 0s11 4.925 11 11-4.925 11-11 11S0 17.075 0 11Zm20 0a9 9 0 1 0-18 0 9 9 0 0 0 18 0Z"
      fill={fill || 'currentColor'}
      fillRule="evenodd"
    />
  </svg>
);

export default SvgStreamRemote;
