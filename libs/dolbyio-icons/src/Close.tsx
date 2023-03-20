import React, { SVGProps } from 'react';

const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill={props.fill || 'currentColor'}
    height="100%"
    viewBox="0 0 16 16"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m2.283 14.883-.088-.088.088.088L8 9.167l5.717 5.716a.825.825 0 0 0 1.166-1.166L9.167 8l5.716-5.717-.088-.088.088.088a.825.825 0 0 0-1.166-1.166l.087.087-.087-.087L8 6.833 2.283 1.117a.825.825 0 0 0-1.166 1.166L6.833 8l-5.716 5.717.087.087-.087-.087a.825.825 0 0 0 1.166 1.166Z"
      fill={props.fill || 'currentColor'}
      stroke={props.fill || 'currentColor'}
      strokeWidth={0.25}
    />
  </svg>
);

export default SvgClose;
