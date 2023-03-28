import type { SVGProps } from 'react';
import React from 'react';

const SvgSuccessFilled = ({ fill, ...rest }: SVGProps<SVGSVGElement>) => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM17.6513 8.11857C17.3007 7.85552 16.806 7.88086 16.4831 8.19516L9.59407 14.9007L6.53767 11.8969L6.44588 11.8178C6.09532 11.554 5.60029 11.5782 5.27605 11.8917C4.94017 12.2164 4.92752 12.7556 5.2478 13.0961L8.95296 16.7298L9.04655 16.8102C9.40395 17.0783 9.90824 17.0525 10.2374 16.7321L17.7409 9.42831L17.825 9.33333C18.0529 9.03412 18.059 8.61505 17.8388 8.30896L17.7542 8.20858L17.6513 8.11857Z"
      fill={fill || 'currentColor'}
    />
  </svg>
);

export default SvgSuccessFilled;
