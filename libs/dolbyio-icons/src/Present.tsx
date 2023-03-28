import type { SVGProps } from 'react';
import React from 'react';

const SvgPresent = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19.5 3.75h-15A2.253 2.253 0 0 0 2.25 6v10.5a2.253 2.253 0 0 0 2.25 2.25h15a2.253 2.253 0 0 0 2.25-2.25V6a2.253 2.253 0 0 0-2.25-2.25Zm.75 12.75a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75V6a.751.751 0 0 1 .75-.75h15a.751.751 0 0 1 .75.75v10.5Zm-4.5 4.5a.75.75 0 0 1-.75.75H9a.75.75 0 1 1 0-1.5h6a.75.75 0 0 1 .75.75Zm-.334-10.374-4.5-3a.75.75 0 0 0-1.166.624v6a.75.75 0 0 0 1.166.624l4.5-3a.751.751 0 0 0 0-1.248Zm-4.166 2.223V9.65l2.398 1.599-2.398 1.599Z"
    />
  </svg>
);

export default SvgPresent;
