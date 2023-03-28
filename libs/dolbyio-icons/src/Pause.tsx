import type { SVGProps } from 'react';
import React from 'react';

const SvgPause = ({ fill, ...rest }: SVGProps<SVGSVGElement>) => (
  <svg
    fill={fill || 'currentColor'}
    height="100%"
    viewBox="0 0 25 24"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      clipRule="evenodd"
      d="M9.18233 6H7.15381C6.60152 6 6.15381 6.44772 6.15381 7V17C6.15381 17.5523 6.60152 18 7.15381 18H9.18233C9.73462 18 10.1823 17.5523 10.1823 17V7C10.1823 6.44772 9.73462 6 9.18233 6ZM17.1537 6H15.1479C14.5957 6 14.1479 6.44772 14.1479 7V17C14.1479 17.5523 14.5957 18 15.1479 18H17.1537C17.706 18 18.1537 17.5523 18.1537 17V7C18.1537 6.44772 17.706 6 17.1537 6Z"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgPause;
