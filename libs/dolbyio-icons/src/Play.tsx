import type { SVGProps } from 'react';
import React from 'react';

const SvgPlay = ({ fill, ...rest }: SVGProps<SVGSVGElement>) => (
  <svg
    fill={fill || 'currentColor'}
    height="100%"
    viewBox="0 0 21 22"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      clipRule="evenodd"
      d="M15.2801 10.0568L6.13654 4.20824C5.5664 3.84357 4.78069 3.97026 4.3816 4.49123C4.23333 4.68476 4.15381 4.91529 4.15381 5.15153V16.8486C4.15381 17.4845 4.71798 18 5.41391 18C5.67245 18 5.92473 17.9273 6.13654 17.7919L15.2801 11.9433C15.8503 11.5787 15.9889 10.8607 15.5898 10.3397C15.5055 10.2296 15.4006 10.1338 15.2801 10.0568Z"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgPlay;
