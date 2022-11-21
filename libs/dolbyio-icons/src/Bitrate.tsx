import * as React from 'react';
import { SVGProps } from 'react';

const SvgBitrate = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)" stroke="#959599">
      <path
        d="M.15 17.96v.15H1.8v2.34h2.28v1.7h5.83v-1.86h2.19v-2.24h2.19v-2.34h2.16v-1.64h3.03v1.68h2.22v2.27h2.94v-1.34h-1.59v-2.4H20.8v-1.61H15v1.74h-2.16v2.24h-2.25v2.4H8.46v1.64H5.43v-1.8H3.24v-2.24H.15v1.32-.01Z"
        fill={props.fill || 'currentColor'}
        strokeWidth={0.3}
      />
      <path
        d="M0 3.926C3.453 3.906 2.953 10.99 7.09 11c4.128 0 5.527-9.01 9.655-9C20.872 2 20.862 8.111 25 8.122"
        strokeWidth={1.8}
        strokeMiterlimit={56}
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill={props.fill || 'currentColor'} d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgBitrate;
