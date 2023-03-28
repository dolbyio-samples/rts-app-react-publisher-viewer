import type { SVGProps } from 'react';
import React from 'react';

const SvgInfo = ({ fill, ...rest }: SVGProps<SVGSVGElement>) => (
  <svg width="100%" height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <g clipPath="url(#clip0_6216_14502)">
      <path
        d="M21.4201 5.9601L18.3201 3.1101L15.2901 0.260098C15.2301 0.210098 15.1701 0.150098 15.0601 0.150098C15.0001 0.150098 14.9401 0.100098 14.8801 0.100098H6.1101C5.7601 0.100098 5.5301 0.320098 5.5301 0.650098V20.8101C5.5301 21.1401 5.7601 21.3601 6.1101 21.3601H21.0201C21.3701 21.3601 21.6001 21.1401 21.6001 20.8101V6.4601C21.6001 6.3001 21.5401 6.1301 21.4201 5.9701V5.9601ZM15.4001 2.0101L18.1501 4.5901L19.5501 5.8501H15.4001V2.0201V2.0101ZM6.6901 20.2601V1.2001H14.2901V6.3501C14.2901 6.6801 14.5201 6.9001 14.8701 6.9001H20.4201V20.2201H6.6901V20.2701V20.2601ZM18.6201 23.5501C18.6201 23.8801 18.3901 24.1001 18.0401 24.1001H3.1801C2.8301 24.1001 2.6001 23.8801 2.6001 23.5501V3.6601C2.6001 3.3301 2.8301 3.1101 3.1801 3.1101C3.5301 3.1101 3.7601 3.3301 3.7601 3.6601V23.0001H18.0901C18.3801 23.0001 18.6201 23.2201 18.6201 23.5501Z"
        fill={fill || 'currentColor'}
        stroke={fill || 'currentColor'}
        strokeWidth="0.3"
      />
      <rect x="9.5" y="9" width="8" height="1" rx="0.5" fill={fill || 'currentColor'} />
      <rect x="9.5" y="12" width="8" height="1" rx="0.5" fill={fill || 'currentColor'} />
      <rect x="9.5" y="15" width="8" height="1" rx="0.5" fill={fill || 'currentColor'} />
    </g>
    <defs>
      <clipPath id="clip0_6216_14502">
        <rect width="19.2" height="24.2" fill="white" transform="translate(2.5)" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgInfo;
