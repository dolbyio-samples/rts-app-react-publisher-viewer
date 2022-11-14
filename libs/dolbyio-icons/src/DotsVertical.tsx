import type { SVGProps } from 'react';
import React from 'react';

const SvgDotsVertical = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill={props.fill || 'currentColor'}
    {...props}
  >
    <path
      fill={props.fill || 'currentColor'}
      d="M13.5 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM12 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
    />
  </svg>
);

export default SvgDotsVertical;
