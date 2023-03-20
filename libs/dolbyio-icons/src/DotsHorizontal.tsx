import React, { SVGProps } from 'react';

const SvgDotsHorizontal = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill={props.fill || 'currentColor'}
    height="100%"
    viewBox="0 0 24 24"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.75 12a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm6-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm-12-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm19.5-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm-12-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm4.5-.75v.75h1.5V12h-1.5Zm4.5 0v.75h1.5V12h-1.5Zm-13.5 0v.75h1.5V12h-1.5Zm18 0v.75h1.5V12h-1.5Zm-13.5 0v.75h1.5V12h-1.5Z"
      fill={props.fill || 'currentColor'}
    />
  </svg>
);

export default SvgDotsHorizontal;
